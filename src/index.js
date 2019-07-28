const kintoneJSSDK = require("@kintone/kintone-js-sdk");

(function() {
  "use strict";

  // 連携アプリID
  const srcAppId = 408;
  const distAppId = 409;

  // 連携フィールド
  const srcTableFieldCode = "Table";
  const distSrcIdFieldCode = "srcレコード番号";

  const deleteEvents = [
    "app.record.index.delete.submit",
    "app.record.detail.delete.submit"
  ];

  const editEvent = ["app.record.index.edit.submit", "app.record.edit.submit"];

  // srcアプリサブテーブル内の同期対象フィールドの定義
  const difineSyncFields = async () => {
    const kintoneApp = new kintoneJSSDK.App();
    const srcAppFields = kintoneApp.getFormFields(srcAppId);
    const distAppFields = kintoneApp.getFormFields(distAppId);
    return Promise.all([srcAppFields, distAppFields]).then(values => {
      const srcTableFieldCodes = Object.keys(
        values[0].properties[srcTableFieldCode].fields
      );
      const distFieldCodes = Object.keys(values[1].properties);

      // srcアプリサブテーブル内のフィールドコードとdistアプリのフィールドコードを比較し、
      // 共通のもののみ同期対象としてフィールドコードを返す。
      const syncFieldCodes = [];
      for (const element of srcTableFieldCodes) {
        if (distFieldCodes.includes(element)) {
          syncFieldCodes.push(element);
        }
      }

      return syncFieldCodes;
    });
  };

  // レコード追加関数
  const addRecord = (
    kintoneBulkRequest,
    srcRecordId,
    tableFieldValue,
    syncFieldCodes
  ) => {
    // distに追加するレコードデータの定義
    const distRecordValue = {};
    const tableFieldCodes = Object.keys(tableFieldValue);
    for (const tableFieldCode of tableFieldCodes) {
      if (syncFieldCodes.includes(tableFieldCode)) {
        distRecordValue[tableFieldCode] = {
          value: undefined
        };
        distRecordValue[tableFieldCode].value =
          tableFieldValue[tableFieldCode].value;
      }
    }
    distRecordValue[distSrcIdFieldCode] = { value: undefined };
    distRecordValue[distSrcIdFieldCode].value = srcRecordId;
    return kintoneBulkRequest.addRecord(distAppId, distRecordValue);
  };

  // レコード削除関数
  const deleteRecords = async (kintoneRecord, deleteQuery) => {
    return kintoneRecord.deleteAllRecordsByQuery(distAppId, deleteQuery);
  };

  // レコード追加イベント
  kintone.events.on("app.record.create.submit.success", async event => {
    const record = event.record;
    const recordId = record.$id.value;
    const tableFieldValues = record[srcTableFieldCode].value;
    const syncFieldCodes = await difineSyncFields();
    const kintoneBulkRequest = new kintoneJSSDK.BulkRequest();
    // サブテーブルの行数分レコードの新規作成リクエストをBulkRequestに追加
    for (const tableFieldValue of tableFieldValues) {
      addRecord(
        kintoneBulkRequest,
        recordId,
        tableFieldValue.value,
        syncFieldCodes
      );
    }
    // リクエスト実行
    kintoneBulkRequest.execute();
  });

  // レコード削除イベント
  kintone.events.on(deleteEvents, async event => {
    const record = event.record;
    const recordId = record.$id.value;
    const deleteQuery = `${distSrcIdFieldCode} = ${recordId}`;
    const kintoneRecord = new kintoneJSSDK.Record();
    return deleteRecords(kintoneRecord, deleteQuery);
  });

  // レコード編集イベント
  kintone.events.on(editEvent, async event => {
    const record = event.record;
    const recordId = record.$id.value;
    const deleteQuery = `${distSrcIdFieldCode} = ${recordId}`;
    const kintoneRecord = new kintoneJSSDK.Record();

    const tableFieldValues = record[srcTableFieldCode].value;
    const syncFieldCodes = await difineSyncFields();
    const kintoneBulkRequest = new kintoneJSSDK.BulkRequest();
    // サブテーブルの行数分レコードの新規作成リクエストをBulkRequestに追加
    for (const tableFieldValue of tableFieldValues) {
      addRecord(
        kintoneBulkRequest,
        recordId,
        tableFieldValue.value,
        syncFieldCodes
      );
    }

    deleteRecords(kintoneRecord, deleteQuery).then(
      kintoneBulkRequest.execute()
    );
  });
})();
