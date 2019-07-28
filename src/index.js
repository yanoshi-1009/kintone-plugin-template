const kintoneJSSDK = require("@kintone/kintone-js-sdk");

(function() {
  "use strict";

  // 連携アプリID
  const srcAppId = 408;
  const distAppId = 409;

  // 連携フィールド
  const srcTableFieldCode = "Table";
  const distSrcIdFieldCode = "srcレコード番号";

  const deleteSubmitEvents = [
    "app.record.index.delete.submit",
    "app.record.detail.delete.submit"
  ];

  const editSubmitEvents = [
    "app.record.index.edit.submit",
    "app.record.edit.submit"
  ];

  // srcアプリサブテーブル内の同期対象フィールドの定義
  const difineSyncFields = async () => {
    const kintoneApp = new kintoneJSSDK.App();
    const srcAppFields = kintoneApp.getFormFields(srcAppId);
    const distAppFields = kintoneApp.getFormFields(distAppId);
    return Promise.all([srcAppFields, distAppFields]).then(fields => {
      const srcTableElementFieldCodes = Object.keys(
        fields[0].properties[srcTableFieldCode].fields
      );
      const distFieldCodes = Object.keys(fields[1].properties);

      // srcアプリサブテーブル内のフィールドコードとdistアプリのフィールドコードを比較し、
      // 共通のもののみ同期対象としてフィールドコードを返す。
      const syncFieldCodes = [];
      for (const srcTableElementFieldCode of srcTableElementFieldCodes) {
        if (distFieldCodes.includes(srcTableElementFieldCode)) {
          syncFieldCodes.push(srcTableElementFieldCode);
        }
      }

      return syncFieldCodes;
    });
  };

  // レコード追加関数
  const createAddRecordsRequest = (
    srcRecordId,
    srcTableFieldValues,
    syncFieldCodes,
    kintoneBulkRequest
  ) => {
    // distに追加するレコードデータの定義
    const distAddedRecords = [];
    const distRecordValue = {};

    for (const srcTableFieldValue of srcTableFieldValues) {
      const tableElementFieldCodes = Object.keys(srcTableFieldValue.value);
      for (const tableElementFieldCode of tableElementFieldCodes) {
        if (syncFieldCodes.includes(tableElementFieldCode)) {
          distRecordValue[tableElementFieldCode] = {
            value: undefined
          };
          distRecordValue[tableElementFieldCode].value =
            srcTableFieldValue.value[tableElementFieldCode].value;
        }
      }
      distRecordValue[distSrcIdFieldCode] = { value: undefined };
      distRecordValue[distSrcIdFieldCode].value = srcRecordId;
      distAddedRecords.push(distRecordValue);
    }
    return kintoneBulkRequest.addRecords(distAppId, distAddedRecords);
  };

  // レコード削除関数
  const executeDeleteRecordsRequest = async (deleteQuery, kintoneRecord) => {
    return kintoneRecord.deleteAllRecordsByQuery(distAppId, deleteQuery);
  };

  // レコード追加イベント
  kintone.events.on("app.record.create.submit.success", async event => {
    const record = event.record;
    const recordId = record.$id.value;
    const tableFieldValues = record[srcTableFieldCode].value;
    const syncFieldCodes = await difineSyncFields();
    const kintoneBulkRequest = new kintoneJSSDK.BulkRequest();
    const kintoneAddRecordsRequest = createAddRecordsRequest(
      recordId,
      tableFieldValues,
      syncFieldCodes,
      kintoneBulkRequest
    );
    return kintoneAddRecordsRequest.execute();
  });

  // レコード削除イベント
  kintone.events.on(deleteSubmitEvents, async event => {
    const record = event.record;
    const recordId = record.$id.value;
    const deleteQuery = `${distSrcIdFieldCode} = ${recordId}`;
    const kintoneRecord = new kintoneJSSDK.Record();
    return executeDeleteRecordsRequest(deleteQuery, kintoneRecord);
  });

  // レコード編集イベント
  kintone.events.on(editSubmitEvents, async event => {
    const record = event.record;
    const recordId = record.$id.value;
    const deleteQuery = `${distSrcIdFieldCode} = ${recordId}`;
    const kintoneRecord = new kintoneJSSDK.Record();

    const tableFieldValues = record[srcTableFieldCode].value;
    const syncFieldCodes = await difineSyncFields();
    const kintoneBulkRequest = new kintoneJSSDK.BulkRequest();
    const kintoneAddRecordsRequest = createAddRecordsRequest(
      recordId,
      tableFieldValues,
      syncFieldCodes,
      kintoneBulkRequest
    );

    // distアプリの当該レコードをすべて削除し、再作成
    executeDeleteRecordsRequest(deleteQuery, kintoneRecord).then(
      kintoneAddRecordsRequest.execute()
    );
  });
})();
