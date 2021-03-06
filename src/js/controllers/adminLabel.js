'use strict';
/*jslint browser: true*/

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminlabelCtrl', function($location, $scope, $state, $auth,
  $stateParams, $http, Account, FileUploader, CONFIG) {
  var labelId = $stateParams.id;
  var currencyDivision = 100;
  $scope.serverURL = CONFIG.url;
  $scope.label = null;
  $scope.dropZoneFiles = null;
  $scope.releasesToProcess = null;
  $scope.catalog = null;
  $scope.releasesToProcess = {
    success: []
  };


  var uploader = $scope.uploader = new FileUploader({
    method: 'POST',
    url: CONFIG.url + '/labels/' + labelId + '/profilePicture/'
  });

  uploader.onAfterAddingFile = function(fileItem) {
    console.info('onAfterAddingFile', fileItem);
    var file = fileItem;
    var filename = file._file.name;
    $http.post(
      CONFIG.url + '/labels/' + labelId + '/profilePicture/createFile/', {
        filename: filename,
      }).success(function(data) {

      var formDataArray = [{
        'GoogleAccessId': data.GoogleAccessId,
        'signature': data.signature,
        'policy': data.policy,
        'key': data.key
      }];

      file.url = data.action;
      file.formData = formDataArray;
      console.log(file);
      file.upload();
    });
  };

  uploader.onCompleteAll = function() {
    $scope.getLabel();
  };

  uploader.onCompleteItem = function() {
    $http.post(
      CONFIG.url + '/labels/' + labelId + '/profilePicture/confirmFile/', {}
    );
  };

  var catalogUploader = $scope.catalogUploader = new FileUploader({
    method: 'POST',
    url: CONFIG.url + '/labels/' + labelId + '/dropZone/'
  });


  $scope.processCDNNegotiation = function() {
    for (var i = 0; i < catalogUploader.queue.length; i++) {
      catalogUploader.processOne(catalogUploader.queue[i]);
    }
  };

  catalogUploader.processOne = function(fileItem) {
    var file = fileItem;
    var fname = file._file.name;
    var filename =
      fname.substr(0, (Math.min(fname.lastIndexOf('.'), fname.length)));
    var extension =
      fname.substr((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);
    $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/createFile/', {
      filename: filename,
      extension: extension,
      size: file.file.size
    }).success(function(data) {

      var formDataArray = [{
        'GoogleAccessId': data.GoogleAccessId,
        'signature': data.signature,
        'policy': data.policy,
        'key': data.key
      }];

      file.url = data.action;
      file.formData = formDataArray;
      console.log(file);
      file.upload();
    });
  };

  /*
  catalogUploader.onAfterAddingFile = function(fileItem) {

  };
  catalogUploader.onWhenAddingFileFailed =
    function(item , filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
  catalogUploader.onAfterAddingFile = function(fileItem) {
    
    console.info('onAfterAddingFile', fileItem);
  };
  catalogUploader.onAfterAddingAll = function(addedFileItems) {
    console.info('onAfterAddingAll', addedFileItems);
  };
  catalogUploader.onBeforeUploadItem = function(item) {
    console.info('onBeforeUploadItem', item);
  };
  catalogUploader.onProgressItem = function(fileItem, progress) {
    console.info('onProgressItem', fileItem, progress);
  };
  catalogUploader.onProgressAll = function(progress) {
    console.info('onProgressAll', progress);
  };
  catalogUploader.onSuccessItem = 
  function(fileItem, response, status, headers) {
    console.info('onSuccessItem', fileItem, response, status, headers);
  };
  catalogUploader.onErrorItem = 
  function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  catalogUploader.onCancelItem = function(fileItem, response, status, headers) {
    console.info('onCancelItem', fileItem, response, status, headers);
  };
  */
  catalogUploader.onCompleteItem =
    function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);

      var fname = fileItem._file.name;
      var filename =
        fname.substr(0, (Math.min(fname.lastIndexOf('.'), fname.length)));
      var extension =
        fname.substr((Math.max(0, fname.lastIndexOf('.')) || Infinity) + 1);


      $http.post(CONFIG.url + '/labels/' + labelId + '/dropZone/confirmFile', {
        filename: filename,
        extension: extension
      });

      $scope.getDropZoneFiles();
    };
  catalogUploader.onCompleteAll = function() {
    console.info('onCompleteAll');
    //catalogUploader.clearQueue()
    $scope.getToProcessReleases();
    //$scope.getDropZoneFiles();
  };

  $scope.getLabel = function() {
    $http.get(CONFIG.url + '/labels/' + labelId)
      .success(function(data) {
        $scope.label = data;
        $scope.label.logo =
          CONFIG.url +
          '/labels/' +
          labelId +
          '/profilePicture/small' +
          '?d=' + Date.now();
      });
  };

  $scope.getDropZoneFiles = function() {
    $http.get(CONFIG.url + '/labels/' + labelId + '/dropZoneFiles')
      .success(function(data) {
        $scope.dropZoneFiles = data;
      });
  };

  $scope.processReleases = function() {
    $http.post(CONFIG.url + '/labels/' + labelId + '/processReleases/', {}).
    success(function() {
      $scope.getToProcessReleases();
      $scope.getDropZoneFiles();
      $scope.getCatalog();
    });
  };

  $scope.getToProcessReleases = function() {
    $http.get(CONFIG.url + '/labels/' + labelId + '/processReleases/info')
      .success(function(data) {
        $scope.releasesToProcess = data;
      });
  };

  $scope.createRelease = function() {
    $location.path('createRelease/' + labelId);
  };

  $scope.adminRelease = function(id) {
    $location.path('adminRelease/' + labelId + '/' + id);
  };

  $scope.getCatalog = function() {
    $http.get(CONFIG.url + '/labels/' + labelId + '/catalog')
      .success(function(data) {
        $scope.catalog = data;
        for (var prop in data) {
          data[prop].cover = CONFIG.url + '/images/' + data[prop].cover;
        }
      });
  };


  // REVENUE PART //

  $scope.getYearToDateRevenue = function() {
    var startDateFormatted = moment().startOf('year').format('DD-MM-YYYY');
    var endDateFormatted = moment().format('DD-MM-YYYY');
    $http.get(CONFIG.url + '/labels/' + labelId + '/revenues/total/' +
        startDateFormatted + '/' + endDateFormatted)
      .success(function(data) {
        if (data.length > 0) {
          $scope.YearToDateRevenue =
            Math.floor(data[0].price) / currencyDivision;
        } else {
          $scope.YearToDateRevenue = 0;
        }
      });
  };

  $scope.getQuarterToDateRevenue = function() {
    var startDateFormatted = moment().startOf('quarter').format('DD-MM-YYYY');
    var endDateFormatted = moment().format('DD-MM-YYYY');
    $http.get(CONFIG.url + '/labels/' + labelId + '/revenues/total/' +
        startDateFormatted + '/' + endDateFormatted)
      .success(function(data) {
        if (data.length > 0) {
          $scope.QuarterToDateRevenue =
            Math.floor(data[0].price) / currencyDivision;
        } else {
          $scope.QuarterToDateRevenue = 0;
        }
      });


  };
  $scope.getTodayRevenue = function() {
    var startDateFormatted = moment().format('DD-MM-YYYY');
    var endDateFormatted = moment().format('DD-MM-YYYY');
    $http.get(CONFIG.url + '/labels/' + labelId + '/revenues/total/' +
        startDateFormatted + '/' + endDateFormatted)
      .success(function(data) {
        if (data.length > 0) {
          $scope.TodayRevenue = Math.floor(data[0].price) / currencyDivision;
        } else {
          $scope.TodayRevenue = 0;
        }
      });

  };


  // DATA PICKER 

  $scope.dates = {
    startDate: moment().startOf('quarter'),
    endDate: moment()
  };

  $scope.ranges = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 days': [moment().subtract(7, 'days'), moment()],
    'Last 30 days': [moment().subtract(30,
      'days'), moment()],
    'This quarter': [moment().startOf('quarter'), moment()],
    'Previous quarter': [moment().startOf('quarter').subtract(3, 'months'),
      moment().endOf('quarter').subtract(3, 'months')
    ]
  };
  //END OF DATA PICKER 


  $scope.dateChanged = function(start, end) {
    $scope.getRevenueData(start, end);
  };

  $scope.getRevenueData = function(startDate, endDate) {
    if (!startDate) {
      startDate = moment().startOf('quarter');
      endDate = moment();
    }
    var startDateFormatted = startDate.format('DD-MM-YYYY');
    var endDateFormatted = endDate.format('DD-MM-YYYY');
    $http.get(CONFIG.url + '/labels/' + labelId +
        '/revenues/expanded/' + startDateFormatted + '/' + endDateFormatted)
      .success(function(data) {
        console.log(data);
        // Get the json with the informations:
        var values = [];
        //Price in the db are stored as 100x time bigger. Restore the right . 
        //representation of the number 
        var currencyDivision = 100;
        var currentIndex = 0;
        var labels = [];
        for (var i = 0; i < data.length; i++) {
          //Data is sorted by data.dataColumn;
          var finalPrice = Math.floor(data[i].price) / currencyDivision;
          var object = {};
          if (!values[currentIndex]) {
            //First Element.

            object.x = moment(data[i].dataColumn, 'DD-MM-YY').toDate();
            object[data[i].Release.catalogNumber] = finalPrice;
            values.push(
              object
            );
          } else {
            // ho almeno un valore 
            if (values[currentIndex].x.getTime() ===
              moment(data[i].dataColumn, 'DD-MM-YY').toDate().getTime()) {
              //same day
              values[currentIndex][data[i].Release.catalogNumber] = finalPrice;
            } else {
              // me moved to the next data
              currentIndex++;

              object.x = moment(data[i].dataColumn, 'DD-MM-YY').toDate();
              object[data[i].Release.catalogNumber] = finalPrice;
              values.push(
                object
              );
            }
          }
          var found = false;

          for (var l = 0; l < labels.length; l++) {
            if ((labels[l].id) === data[i].Release.catalogNumber) {
              found = true;
            }
          }
          if (!found) {
            labels.push({
              id: data[i].Release.catalogNumber,
              name: data[i].Release.catalogNumber
            });
          }
          labels = labels.sort();
        }

        // FILLERS: ads for each label a valid number per each time point
        for (var v = 0; v < values.length; v++) {
          for (var k = 0; k < labels.length; k++) {
            if (!values[v][labels[k].id]) {
              values[v][labels[k].id] = 0;
            }
          }
        }


        console.log(labels.map(function(obj) {
          return obj.name;
        }).sort());


        // data ready to be displayed in the chart;


        var series = [];
        for (i = labels.length - 1; i >= 0; i--) {
          series[i] = {
            color: $scope.app.colorArray[i],
            id: labels[i].id,
            y: labels[i].id,
            axis: 'y',
            thickness: '2px',
            type: 'column',
            label: labels[i].name
          };
        }

        $scope.data = values;
        $scope.options = {
          margin: {
            right: 30,
            top: 20,
          },
          stacks: [{
            axis: 'y',
            series: (labels.map(function(obj) {
              return obj.name;
            }).sort())
          }],
          axes: {
            x: {
              zoomable: false,
              type: 'date',
              ticksFormat: '%B',
              ticks: d3.time.months,
              ticksRotate: 0
            },
            y: {
              zoomable: true,
              ticksFormat: '.2f',
              ticks: 5,
              min: 0
            }
          },
          tooltip: {
            mode: 'scrubber',
            formatter: function(x, y, series) {

              return moment(x).format('Do MMM, dddd') +
                ' ' + y + ' ' + series.label;
            }
          },
          lineMode: 'cardinal',
          series: series,
          columnsHGap: 0,
        };
      });


  };





  $scope.getToProcessReleases();
  $scope.getDropZoneFiles();
  $scope.getCatalog();
  $scope.getLabel();
  $scope.getRevenueData();
  $scope.getYearToDateRevenue();
  $scope.getQuarterToDateRevenue();
  $scope.getTodayRevenue();
});
