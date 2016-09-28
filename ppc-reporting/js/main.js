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

  renderTable(tableData);
});


function groupDailyData(data) {
  return _.chain(data).groupBy("Ad ID").map(function (ad) {
    return {
      adTitle: _.head(ad)["Ad Headline"],
      campaign: _.head(ad)["Campaign Name"].replace("TS Demo Drive:", ""),
      clicks: _.sum(_.map(ad, "Clicks")),
      impressions: _.sum(_.map(ad, "Impressions"))
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
      "<td class='cell-number'>" + ad.impressions + "</td>" +
      "<td class='cell-number'>" + Math.round(100 * ad.clicks / ad.impressions * 100000) / 100000 + "</td>" +
      "</tr>"
    );
  });
}
