import Papa from "papaparse";

($ => {
  "use strict";

  const createCSVInputField = () => {
    const CSVInputField = kintone.app.record.getSpaceElement("CSVInputField");
    const $inputForm = $(
      '<p>入力できるのはCSVファイルのみです。<br>CSVファイルの1行目とテーブルのフィールドコードを揃える必要があります。<br><input type="file" id="inputFile" accept="text/csv" /></p>'
    );
    $(CSVInputField).append($inputForm);
    $("#inputFile").change(getCsvValues);
  };

  const getCsvValues = () => {
    const element_inputFile = document.getElementById("inputFile");

    // ファイルの存在確認
    if (!element_inputFile.files) {
      return;
    }

    // inputFileではmultipule:falseなのでfileは単一
    const file = element_inputFile.files[0];

    // parse後の配列用変数
    const parsedValues = [];

    // ファイルの読み取り設定
    const parseConfig = {
      delimiter: "", // auto-detect
      newline: "", // auto-detect
      quoteChar: '"',
      escapeChar: '"',
      header: true,
      transformHeader: undefined,
      dynamicTyping: false,
      preview: 5000, // kintoneのテーブル行数制限値
      encoding: "",
      worker: false,
      comments: false,
      step: results => {
        parsedValues.push(results.data[0]);
      },
      complete: () => {
        setParsedValuesToTable(parsedValues);
      },
      error: undefined,
      download: false,
      downloadRequestHeaders: undefined,
      skipEmptyLines: true,
      chunk: undefined,
      fastMode: undefined,
      beforeFirstChunk: undefined,
      withCredentials: undefined,
      transform: undefined,
      delimitersToGuess: [",", "\t", "|", ";", Papa.RECORD_SEP, Papa.UNIT_SEP]
    };

    Papa.parse(file, parseConfig);
  };

  const setParsedValuesToTable = parsedValues => {
    const record = kintone.app.record.get();
    const outputTableValues = record.record.outputTable.value;
    // CSVのフォーマットチェック(先にやっとくほうがベター)
    if (
      JSON.stringify(Object.keys(parsedValues[0])) !==
      JSON.stringify(Object.keys(outputTableValues[0].value))
    ) {
      window.alert("CSVの形式が異なります");
      return;
    }

    const row = JSON.parse(JSON.stringify(outputTableValues[0]));
    outputTableValues.length = 0;

    parsedValues.forEach(value => {
      Object.keys(value).forEach(key => {
        row.value[key].value = value[key];
      });
      outputTableValues.push(JSON.parse(JSON.stringify(row)));
    });

    kintone.app.record.set(record);
  };

  const events = ["app.record.create.show", "app.record.edit.show"];

  kintone.events.on(events, () => {
    createCSVInputField();
  });
})(jQuery);
