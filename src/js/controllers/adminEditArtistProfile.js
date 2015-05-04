'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminEditArtistProfile', function($location, $scope, $state, $auth, $stateParams, $http, $modal, Account, FileUploader, CONFIG) {
    var artistId = $scope.artistId = $stateParams.id
    $scope.serverURL = CONFIG.url

    $scope.itemsByPage = 10;
    $scope.currentArtist = null;
    $scope.isSearching = false
    $scope.editIsSearching = false
    $scope.nameAvailable = false
    $scope.editNameAvailable = false

    $scope.nameTooShort = true
    $scope.editNameTooShort = true
    $scope.searchUserResults = []
    console.log("CONTROLELR ADMINARTIST")
    $scope.artist;
    // should be merged with the underneath function searchForEditArtistNameAvailability


    var uploader = $scope.uploader = new FileUploader({
        url: CONFIG.url + '/artists/' + $scope.artistId + '/profilePicture/1400/1400/',
        headers: {
            'Authorization': 'Bearer ' + $auth.getToken()
        },
        data: {
            user: $scope.user
        },
    });
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
        $scope.loadedImage = progress;

    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
        uploader.queue[0].upload();
        uploader.queue.pop();
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
        $scope.getArtist();
    };


    $scope.getArtist = function() {
        $http.get(CONFIG.url + '/artists/' + artistId)
            .success(function(data) {
                $scope.artist = data

            })
    }

    $scope.getArtist()
});