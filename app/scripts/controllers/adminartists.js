'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdminartistsCtrl
 * @description
 * # AdminartistsCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdminartistsCtrl', function ($scope,  $http, CONFIG) {
    var CHARACTER_BEFORE_SEARCH = 2;
    $scope.currentArtist = null;
    $scope.isSearching = false
    $scope.editIsSearching = false
    $scope.nameAvailable = false
    $scope.editNameAvailable = false

    $scope.nameTooShort = true
    $scope.editNameTooShort = true
    $scope.searchUserResults = null

    $scope.artistList = {}
    // should be merged with the underneath function searchForEditArtistNameAvailability
    $scope.searchArtistsAvailability = function() { 
      	if($scope.searchArtistField.length > CHARACTER_BEFORE_SEARCH){
      		$scope.isSearching = true;
      		$scope.nameTooShort = false;
      		$http.get(CONFIG.url + '/artists/search/'+$scope.searchArtistField)
      		.success(function(data) {
          		
          		$scope.isSearching = false
          		if(data.length == 0){
          			//!date --> the object is empty, there is no other artist,  with this name, the name is available
          			$scope.nameAvailable = true
          		}else{
          			//date --> the object has something
          			$scope.nameAvailable = false
          		}
        	})
      	} else {
      		$scope.nameTooShort = true;
      	}
   	};

   	$scope.searchForEditArtistNameAvailability =function(){
   		if($scope.currentArtist.displayName.length > CHARACTER_BEFORE_SEARCH){
      		$scope.editIsSearching = true;
      		$scope.editNameTooShort = false;
      		$http.get(CONFIG.url + '/artists/search/'+$scope.currentArtist.displayName)
      		.success(function(data) {
          		
          		$scope.editIsSearching = false
          		if(data.length == 0){
          			//!date --> the object is empty, there is no other artist,  with this name, the name is available
          			$scope.editNameAvailable = true
          		}else{
          			//date --> the object has something
          			$scope.editNameAvailable = false
          		}
        	})
      	} else {
      		$scope.editNameTooShort = true;
      	}


   	}
   	$scope.addArtist = function(){
   		console.log("ADD Artist")
   		// TODO STRING SANITIZING
   		$http.post(CONFIG.url + '/artists/', {displayName:$scope.searchArtistField}).
		  success(function(data, status, headers, config) {
		  	$scope.updateArtistList();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}
   	$scope.updateArtist = function(){
   		var artistId = $scope.currentArtist.id;
   		$http.put(CONFIG.url + '/artists/'+artistId, $scope.currentArtist).
		  success(function(data, status, headers, config) {
		  	$scope.updateArtistList();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}

   	$scope.searchUser = function() {
   		if($scope.searchUserField.length > CHARACTER_BEFORE_SEARCH){
	   		$http.get(CONFIG.url + '/users/search/'+$scope.searchUserField)
	      		.success(function(data) {
	          		$scope.searchUserResults = data
   					console.log($scope.searchUserResults)
	        	})
	    }
   	}
   	$scope.selectFromMultipleUsers = function(user){
   		// create as an array to align to api return tyep 
   		$scope.searchUserResults = [user];
   		console.log($scope.searchUserResults)

   	}

   	$scope.addUserArtistAssociation = function(){
   		var userId = $scope.searchUserResults[0].id;
   		var artistId = $scope.currentArtist.id;
   		console.log(userId);
   		$http.post(CONFIG.url + '/artists/'+artistId+"/owners/", {newOwner:userId}).
		  success(function(data, status, headers, config) {
		  	$scope.editArtist(artistId)
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}
   	$scope.removeOwner = function(userId){
   		var artistId = $scope.currentArtist.id;
   		$http.delete(CONFIG.url + '/artists/'+artistId+"/owners/"+userId).
		  success(function(data, status, headers, config) {
		  	$scope.editArtist(artistId)
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}

   	/*
   	// ACTIVATE ARTIST?  not necessary at this stage 
   	$scope.activateArtist = function(companyId){
   		console.log("ACTIVATE")
   		 
   		$http.put(CONFIG.url + '/companies/'+companyId, {isActive:true}).
		  success(function(data, status, headers, config) {
		  		$scope.updateCompanyList();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}
   	$scope.deactivateCompany = function(companyId){
   		 
   		$http.put(CONFIG.url + '/companies/'+companyId, {isActive:false}).
		  success(function(data, status, headers, config) {
		  		$scope.updateCompanyList();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}

   	*/

    $scope.editArtist = function(idArtist){
   		$http.get(CONFIG.url + '/artists/'+idArtist)
      		.success(function(data) {
      				console.log(data)
          			$scope.currentArtist = data
          			$scope.searchForEditArtistNameAvailability()
          	})
   	}
   	$scope.updateArtistList = function(){
   		$http.get(CONFIG.url + '/artists/')
      		.success(function(data) {
      				console.log(data)
          			$scope.artistList = data
          		
        	})
   	}

   	$scope.updateArtistList()
  });