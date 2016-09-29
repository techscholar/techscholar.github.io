var groupedData,
  clickData,
  categories,
  mostClickedIds,
  impressionsTrendData,
  adMetadata;
$.ajax({
  type: "GET",
  url: "/ppc-reporting/data/data-linkedin.json"
}).done(function (data) {
  var dailyData = data,
    tableData = groupDailyData(data);

  setInitialDates(dailyData);

  $("#start-date, #end-date").change(function () {
    data = _.filter(dailyData, function (dataObj) {
      var startDate = new Date($("#start-date").val()),
        endDate = new Date($("#end-date").val()),
        dataDate = new Date(dataObj["Date (UTC time zone)"]);

      return dataDate >= startDate && dataDate <= endDate;
    });

    renderTable(groupDailyData(data));
  });

  renderTable(tableData);
});

function setInitialDates(dailyData) {
  var initialMin = _.minBy(dailyData, "Date (UTC time zone)")["Date (UTC time zone)"].split("/").reverse(),
    initialMax = _.maxBy(dailyData, "Date (UTC time zone)")["Date (UTC time zone)"].split("/").reverse();

  _.each([initialMin, initialMax], function (dateArr) {
    if (dateArr[2].length < 2) {
      dateArr[2] = "0" + dateArr[2];
    }
  });

  $("#start-date").val([initialMin[0], initialMin[2], initialMin[1]].join("-"));
  $("#end-date").val([initialMax[0], initialMax[2], initialMax[1]].join("-"));
}


function groupDailyData(data) {
  return _.chain(data).groupBy("Ad ID").map(function (ad) {
    return {
      adTitle: _.head(ad)["Ad Headline"],
      campaign: _.head(ad)["Campaign Name"].replace("TS Demo Drive:", ""),
      clicks: _.sum(_.map(ad, "Clicks")),
      deltaClicks: "+" + _.chain(ad).sortBy("Date (UTC time zone)").last().value()["Clicks"],
      impressions: _.sum(_.map(ad, "Impressions")),
      deltaImpressions:"+" + _.chain(ad).sortBy("Date (UTC time zone)").last().value()["Impressions"]
    };
  }).value();
}

function renderTable(tableData) {
  var table = $("#data-table-body");

  table.empty();

  tableData = _.sortBy(tableData, function (ad) {
    return ad.clicks *    -1;
  });

  _.each(tableData, function (ad) {
    table.append("<tr>" +
      "<td class='ad-title'>" + ad.adTitle + "</td>" +
      "<td>" + ad.campaign + "</td>" +
      "<td class='cell-number'>" + ad.clicks + "</td>" +
      "<td class='cell-number'>" + ad.deltaClicks + "</td>" +
      "<td class='cell-number'>" + ad.impressions + "</td>" +
      "<td class='cell-number'>" + ad.deltaImpressions + "</td>" +
      "<td class='cell-number'>" + Math.round(100 * ad.clicks / ad.impressions * 100000) / 100000 + "</td>" +
      "</tr>"
    );
  });
}
