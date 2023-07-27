export async function fetchInfo(id, sheetName) {
  try {
    const response = await fetch(
      `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?sheet=${sheetName}`
    );

    const textData = await response.text();

    const data = JSON.parse(textData.substring(47).slice(0, -2));

    let result = [];

    let tableLabels = data.table.cols.map((col) => {
      return col.label;
    });

    data.table.rows.forEach((row) => {
      let obj = {};
      tableLabels.forEach((label, index) => {
        obj[label] = row.c[index].v;
      });
      result.push(obj);
    });

    return {
      labels: tableLabels,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export function createTable(data) {
  let table = document.querySelector(".table");
  let sortedData = data.data.sort(
    (a, b) => b.volume_miqdori - a.volume_miqdori
  );
  let tableHeadTr = document.createElement("tr");
  tableHeadTr.classList.add("head");

  let tableHead = document.createElement("thead");
  let tableBody = document.createElement("tbody");

  // creating thead
  data.labels.forEach((label, index) => {
    let th = document.createElement("th");
    if (index == -0) {
      let rateTh = document.createElement("th");
      rateTh.textContent = "reyting";
      tableHeadTr.append(rateTh);
    }

    th.textContent = label;
    tableHeadTr.append(th);
    tableHead.append(tableHeadTr);
  });

  // creating tbody
  sortedData.forEach((element, index) => {
    let tr = document.createElement("tr");

    let attrCount = 0;
    for (let key in element) {
      let tdImg = document.createElement("td");
      let td = document.createElement("td");

      attrCount += 1;

      if (index + 1 < 4 && attrCount === 1) {
        let img = document.createElement("img");
        tdImg.classList.add("image");

        switch (index) {
          case 0:
            img.src = "./images/trophy-gold.webp";
            break;
          case 1:
            img.src = "./images/trophy-silver.webp";
            break;
          case 2:
            img.src = "./images/trophy-bronze.webp";
            break;
        }

        tdImg.append(img);
        tr.append(tdImg);
      }
      if ((index + 1) >=4 && attrCount === 1) {
        let td = document.createElement("td");
        td.textContent = index + 1;
        tr.append(td);
      }

      td.textContent = element[key];
      if (key === "name") td.classList.add("name");
      tr.append(td);
    }

    tableBody.append(tr);
  });

  table.append(tableHead);
  table.append(tableBody);
}
