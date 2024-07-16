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
  if (typeof header !== 'undefined') {
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
    showInRangeSelector : true,
    xlabel: "time_stamp [s]",
    // showRangeSelector : true,
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
  select_columns[0] = true; // time_stamp
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
    xlabel: "time_stamp [s]",
    showInRangeSelector : true,
    // showRangeSelector : true,
  });
}

function set_pair() {
  let lines = reader.result.split("\n");
  var data = "";
  var min = 100000.0;
  var max = -100000.0;
  var sel_data_num = 0;
  var x_label = "";
  var y_label = "";
  select_columns[0] = false;
  lines.forEach((line) => {
    var i = 0;
    line.split(",").forEach((cell) => {
      if (select_columns[i] && sel_data_num < 2) {
        var val = parseFloat(String(cell),10);
        if (!isNaN(val)) {
          min = Math.min(min, val);
          max = Math.max(max, val);
        }
        else
        {
          if (x_label == "")
            x_label = cell;
          else
            y_label = cell;
        }
        data += cell + ",";
      }
      i = i + 1;
    });
    if (select_columns[i])
      sel_data_num = sel_data_num + 1;
    data = data.slice(0, data.length - 1) + "\n";
  });
  console.log(x_label,y_label);
  g = new Dygraph(document.getElementById("graph"), data, {
    // showRoller: true,
    // width: 800,
    // height: 800,
    dateWindow: [min, max],
    valueRange: [min, max],
    xlabel: x_label,
    ylabel: y_label,
    drawPoints: true,
    drawAxesAtZero: true,
    pointSize: 2.0,
    rollPeriod: 1,
    // legend: "always", // 凡例常表示
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