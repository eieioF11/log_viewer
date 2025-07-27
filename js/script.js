var reader;
var header;
let x_select_id = 0;
let x_select_column = "";
let y_select_num = 0;
let y_select_column = "";
let y_select_columns = new Array();

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
  var x_select = document.getElementById("x-axis");
  var y_select = document.getElementById("y-axis");
  if (typeof header !== 'undefined') {
    header.forEach((element) => {
      if (element != "") {
        x_select.remove(element);
        y_select.remove(element);
      }
    });
  }
  // //読込み後グラフ表示
  // g = new Dygraph(document.getElementById("graph"), reader.result, {
  //   showRoller: true,
  //   legend: "always", // 凡例常表示
  //   showInRangeSelector: true,
  //   xlabel: "time_stamp [s]",
  //   // showRangeSelector : true,
  // });
  console.log(reader.result);
  console.log(typeof reader.result);
  // 先頭行をヘッダとして格納
  header = reader.result.split("\n")[0].split(",");
  console.log(reader.result.split("\n"));
  let i = 0;
  x_select_column = "time_stamp [s]"
  y_select_columns = new Array();
  header.forEach((element) => {
    // if (element != "time_stamp" && element != "") {
    if (element != "") {
      console.log(element);
      // option要素を生成
      let x_option = document.createElement("option");
      x_option.text = element;
      x_option.value = element;
      let y_option = document.createElement("option");
      y_option.text = element;
      y_option.value = element;
      if (i == 0) {
        x_select_column = element;
        x_option.selected = true;
        y_select_columns.push(false);
      }
      else {
        y_option.selected = true;
        y_select_num += 1;
        y_select_column = element;
        y_select_columns.push(true);
      }
      x_select.add(x_option);
      y_select.add(y_option);
      i = i + 1;
    }
  });
  console.log(x_select_column);
  //読込み後グラフ表示
  g = new Dygraph(document.getElementById("graph"), reader.result, {
    showRoller: true,
    legend: "always", // 凡例常表示
    showInRangeSelector: true,
    xlabel: x_select_column,
    // showRangeSelector : true,
  });
}

function set() {
  let lines = reader.result.split("\n");
  var data = "";
  var y_label = "";
  var select_count = 0;
  // y_select_columns[0] = true; // time_stamp
  lines.forEach((line) => {
    var i = 0;
    line.split(",").forEach((cell) => {
      if (y_select_columns[i] || x_select_id == i) data += cell + ",";
      i = i + 1;
    });
    data = data.slice(0, data.length - 1) + "\n";
  });
  console.log(data);
  if (y_select_num == 0) {
    alert("Please select at least one Y-axis data.");
    return;
  }
  else if (y_select_num == 1) {
    g = new Dygraph(document.getElementById("graph"), data, {
      showRoller: true,
      legend: "always", // 凡例常表示
      xlabel: x_select_column,
      ylabel: y_select_column,
      showInRangeSelector: true,
      // showRangeSelector : true,
    });
  }
  else {
    g = new Dygraph(document.getElementById("graph"), data, {
      showRoller: true,
      legend: "always", // 凡例常表示
      xlabel: x_select_column,
      showInRangeSelector: true,
      // showRangeSelector : true,
    });
  }
}

// function set_pair() {
//   let lines = reader.result.split("\n");
//   var data = "";
//   var min = 100000.0;
//   var max = -100000.0;
//   var sel_data_num = 0;
//   var x_label = "";
//   var y_label = "";
//   y_select_columns[0] = false;
//   lines.forEach((line) => {
//     var i = 0;
//     line.split(",").forEach((cell) => {
//       if (y_select_columns[i] && sel_data_num < 2) {
//         var val = parseFloat(String(cell), 10);
//         if (!isNaN(val)) {
//           min = Math.min(min, val);
//           max = Math.max(max, val);
//         }
//         else {
//           if (x_label == "")
//             x_label = cell;
//           else
//             y_label = cell;
//         }
//         data += cell + ",";
//       }
//       i = i + 1;
//     });
//     if (y_select_columns[i])
//       sel_data_num = sel_data_num + 1;
//     data = data.slice(0, data.length - 1) + "\n";
//   });
//   console.log(x_label, y_label);
//   g = new Dygraph(document.getElementById("graph"), data, {
//     // showRoller: true,
//     // width: 800,
//     // height: 800,
//     dateWindow: [min, max],
//     valueRange: [min, max],
//     xlabel: x_label,
//     ylabel: y_label,
//     drawPoints: true,
//     drawAxesAtZero: true,
//     pointSize: 2.0,
//     rollPeriod: 1,
//     // legend: "always", // 凡例常表示
//   });
// }

function y_axis_sel() {
  // 選択されているvalueを取得
  y_select_columns = new Array();
  y_select_num = 0;
  // y_select_columns.push(true); // time_stamp
  for (let option of document.getElementById("y-axis").options) {
    if (option.selected && x_select_column == option.value) {
      alert("Please select a different Y-axis data from the X-axis data.");
    }
    else if (option.selected) {
      y_select_num += 1;
      y_select_column = option.value;
      y_select_columns.push(true);
    }
    else
      y_select_columns.push(false);
  }
  console.log("y_select_num: " + y_select_num);
  console.log("y_select_column: " + y_select_column);
  console.log(y_select_columns);
}

function x_axis_sel() {
  var count = 0;
  for (let option of document.getElementById("x-axis").options) {
    if (option.selected) {
      x_select_id = count;
      x_select_column = option.value;
      break;
    }
    count += 1;
  }
  console.log("x_select_id: " + x_select_id);
  console.log(x_select_column);
}