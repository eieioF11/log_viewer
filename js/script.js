var reader;
var header;
function init() {
  var file = document.querySelector("#getfile");
  file.onchange = function () {
    var fileList = file.files;
    reader = new FileReader();
    reader.readAsText(fileList[0]); // onchange時に読込む
    reader.onload = function () {
      //読込み後グラフ表示
      g = new Dygraph(document.getElementById("graph"), reader.result, {
        showRoller: true,
        legend: "always", // 凡例常表示
      });
      console.log(reader.result);
      console.log(typeof reader.result);
      // 先頭行をヘッダとして格納
      header = reader.result.split("\n")[0].split(",");
      console.log(reader.result.split("\n"));
      var select = document.getElementById("columns");
      header.forEach((element) => {
        if (element != "time_stamp" && element != "") {
          console.log(element);
          // option要素を生成
          let option = document.createElement("option");
          // option要素のテキストを設定
          option.text = element;
          // option要素の値を設定
          option.value = element;
          // 生成したoption要素をselect要素に追加
          select.add(option);
        }
      });
    };
  };
}
function sel() {
  // 選択されているvalueを取得
  let options = document.getElementById("columns").options;
  let columns_str = new Array();
  let select_columns = new Array();
  select_columns.push(true); // time_stamp
  for (let option of options) {
    // 各option要素の選択状態を判定
    // true（選択状態）の場合、料理名を配列に格納
    if (option.selected) {
      columns_str.push(option.value);
      select_columns.push(true);
    } else select_columns.push(false);
  }
  let lines = reader.result.split("\n");
  var data = "";
  for (let line of lines) {
    cells = line.split(",");
    var i = 0;
    for (let cell of cells) {
      if (select_columns[i]) data += cell + ",";
      i++;
    }
    data = data.slice(0, data.length - 1);
    data += "\n";
  }
  g = new Dygraph(document.getElementById("graph"), data, {
    showRoller: true,
    legend: "always", // 凡例常表示
  });
  // console.log(data);
  // console.log(select_columns);
  // console.log(columns_str);
}