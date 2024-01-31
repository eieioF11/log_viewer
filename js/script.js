var reader;
var header;
let select_columns = new Array();

function init() {
  var file = document.querySelector("#getfile");
  // document.getElementById("columns").reset();
  file.onchange = function () {
    var fileList = file.files;
    reader = new FileReader();
    reader.readAsText(fileList[0]); // onchange時に読込む
    reader.onload = function () {
      load();
    };
  };
}

function load() {
  var select = document.getElementById("columns");
  if (typeof header !== 'undefined')
  {
    header.forEach((element) => {
      if (element != "") {
        select.remove(element);
      }
    });
  }
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
}

function set() {
  let lines = reader.result.split("\n");
  var data = "";
  lines.forEach((line) => {
    var i = 0;
    line.split(",").forEach((cell) => {
      if (select_columns[i]) data += cell + ",";
      i = i + 1;
    });
    data = data.slice(0, data.length - 1) + "\n";
  });
  g = new Dygraph(document.getElementById("graph"), data, {
    showRoller: true,
    legend: "always", // 凡例常表示
  });
}

function sel() {
  // 選択されているvalueを取得
  select_columns = new Array();
  select_columns.push(true); // time_stamp
  for (let option of document.getElementById("columns").options) {
    if (option.selected)
      select_columns.push(true);
    else
      select_columns.push(false);
  }
  // console.log(data);
  // console.log(select_columns);
}