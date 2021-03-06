//Set Linter for browser support,
//and exclude constructor name should start with an uppercase letter
//in order to support Angular 'ng' notation
/*jslint browser: true*/
/*jshint -W055 */
'use strict';

angular.module('ngCart', ['ngCart.directives'])
  .config([
    function() {}
  ])
  .provider('$ngCart', function() {
    this.$get = function() {};
  })
  .run(['$rootScope', 'ngCart', 'ngCartItem', 'store', '$http', 'CONFIG',
    function($rootScope, ngCart, ngCartItem, store, $http, CONFIG) {

      $rootScope.$on('ngCart:change', function() {
        ngCart.$save();
      });

      if (angular.isObject(store.get('cart'))) {
        ngCart.$restore(store.get('cart'));
      } else {
        ngCart.init();
      }

      $http.get(CONFIG.url + '/me/cart/currency')
        .success(function(data) {
          var cart = ngCart.$cart;
          cart.currencyISOName = data.shortname;
          cart.currencySymbol = data.symbol;
          cart.currency = {
            id: data.id,
            symbol: data.symbol,
            shortname: data.shortname
          };
          cart.convertedPriceTable = [];
          for (var i = 0; i < data.ConvertedPrices.length; i++) {
            cart.convertedPriceTable[data.ConvertedPrices[i].MasterPrice] =
              data.ConvertedPrices[i].price;
          }
          ngCart.consolidateWithDB();
        });
    }
  ])

.service('ngCart', ['$rootScope', 'ngCartItem', 'store', '$http',
  '$auth', 'CONFIG',

  function($rootScope, ngCartItem, store, $http, $auth, CONFIG) {

    this.init = function() {

      this.$cart = {
        currency: {
          id: null,
          symbol: null,
          shortname: null
        },
        convertedPriceTable: null,
        shipping: null,
        taxRate: null,
        tax: null,
        items: []
      };



    };
    // In the database there is a row for each element, even if duplicate. 
    // It is later flatter at application level
    // remove an entry from the db.
    this.removeItemAndSaveToDB = function(id, quantity) {
      if (id.indexOf('release') > -1) {
        $http.delete(CONFIG.url + '/me/cart/release/' + id.split('-').pop());
      }
      if (id.indexOf('track') > -1) {
        $http.delete(CONFIG.url + '/me/cart/track/' + id.split('-').pop());
      }
      this.removeItemById(id, quantity);
    };

    // In the database there is a row for each element, even if duplicate. 
    // It is later flatter at application level
    this.addItemAndSaveToDB = function(id, name, price, quantity, data) {
      if (id.indexOf('release') > -1) {
        $http.post(CONFIG.url + '/me/cart/release/' + id.split('-').pop());
      }

      if (id.indexOf('track') > -1) {
        $http.post(CONFIG.url + '/me/cart/track/' + id.split('-').pop());
      }
      this.addItem(id, name, price, quantity, data);
    };

    this.addItem = function(id, name, price, quantity, data) {

      var inCart = this.getItemById(id);

      if (typeof inCart === 'object') {
        //Update quantity of an item if it's already in the cart
        inCart.setQuantity(quantity, true);
      } else {
        var newItem = new ngCartItem(id, name, price, quantity, data);
        this.$cart.items.push(newItem);
        $rootScope.$broadcast('ngCart:itemAdded', newItem);
      }

      $rootScope.$broadcast('ngCart:change', {});
    };

    this.getItemById = function(itemId) {
      var items = this.getCart().items;
      var build = false;

      angular.forEach(items, function(item) {
        if (item.getId() === itemId) {
          build = item;
        }
      });
      return build;
    };

    this.setShipping = function(shipping) {
      this.$cart.shipping = shipping;
      return this.getShipping();
    };

    this.getShipping = function() {
      if (this.getCart().items.length === 0) {
        return 0;
      } else {
        return this.getCart().shipping;
      }
    };
    this.getConvertedPrice = function(masterPrice, data) {
      // force the runtime enviroment to consider price as a float.
      var price = 0.0;
      if (!isNaN(parseFloat(masterPrice))) {
        //Master price is a number
        price = this.getCart().convertedPriceTable[masterPrice];
      } else {
        if (data) {
          // IF THERE IS NO MASTER PRICE, AND THERE IS A DATA
          //this must be a release, let's run through all the Tracks
          var conversionTable = this.getCart().convertedPriceTable;
          for (var i = 0; i < data.Tracks.length; i++) {
            price += +parseFloat(conversionTable[data.Tracks[i].Price]);
          }
        } else {
          // Price impossible to calculate.
          // TODO (bortignon@): localize the string.
          price = 'Price not Available';
        }
      }
      return price;
    };

    this.getCurrency = function() {
      return this.$cart.currency;
    };

    this.getCurrencyISOName = function() {
      return this.$cart.currency.shortname;
    };

    this.getCurrencySymbol = function() {
      return this.$cart.currency.symbol;
    };

    this.setTaxRate = function(taxRate) {
      this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
      return this.getTaxRate();
    };

    this.getTaxRate = function() {
      return this.$cart.taxRate;
    };

    this.getTax = function() {
      var taxRate = this.getCart().taxRate;
      return +parseFloat(((this.getSubTotal() / 100) * taxRate
)).toFixed(2);
    };

    this.setCart = function(cart) {
      this.$cart = cart;
      return this.getCart();
    };

    this.getCart = function() {
      return this.$cart;
    };

    this.getItems = function() {
      return this.getCart().items;
    };
    this.getItemsIds = function() {
      var ids = [];
      var items = this.getItems();
      angular.forEach(items, function(item) {
        ids.push(item.getId());
      });
      return ids;
    };

    this.getItemsIdsAndQuantities = function() {
      var objects = [];
      var items = this.getItems();
      angular.forEach(items, function(item) {
        objects.push({
          id: item.getId(),
          quantity: item.getQuantity()
        });
      });
      return objects;
    };

    this.getTotalItems = function() {
      var count = 0;
      var items = this.getItems();
      angular.forEach(items, function(item) {
        count += item.getQuantity();
      });
      return count;
    };

    this.getTotalUniqueItems = function() {
      return this.getCart().items.length;
    };

    this.getSubTotal = function() {
      var total = 0;
      var cart = this;
      angular.forEach(this.getCart().items, function(item) {
        total += cart.getItemTotal(item);
      });
      return +parseFloat(total).toFixed(2);
    };

    this.totalCost = function() {
      var totalCost = this.getSubTotal() + this.getShipping() + this.getTax();
      return +parseFloat(totalCost).toFixed(2);
    };

    this.removeItem = function(index) {



      this.$cart.items.splice(index, 1);
      $rootScope.$broadcast('ngCart:itemRemoved', {});
      $rootScope.$broadcast('ngCart:change', {});

    };
    // quantity is a positive number
    this.removeItemById = function(id, quantity) {

      var cart = this.getCart();
      angular.forEach(cart.items, function(item, index) {
        if (item.getId() === id) {
          if (!quantity) {
            // if there is no quantity left, set the quantity to the current 
            // quantity when checking the quantity of the object in order to 
            // remove it, it will always return to 0.
            quantity = cart.items[index].getQuantity();
          }
          cart.items[index].setQuantity(-quantity, true);
          if (cart.items[index].getQuantity() <= 0) {
            cart.items.splice(index, 1);
          }
        }
      });
      this.setCart(cart);
      $rootScope.$broadcast('ngCart:itemRemoved', {});
      $rootScope.$broadcast('ngCart:change', {});
    };

    this.empty = function() {
      $rootScope.$broadcast('ngCart:change', {});
      this.$cart.items = [];
    };

    this.toObject = function() {
      if (this.getItems().length === 0) {
        return false;
      }
      var items = [];
      angular.forEach(this.getItems(), function(item) {
        items.push(item.toObject());
      });

      return {
        shipping: this.getShipping(),
        tax: this.getTax(),
        taxRate: this.getTaxRate(),
        subTotal: this.getSubTotal(),
        totalCost: this.totalCost(),
        items: items
      };
    };

    this.consolidateWithDB = function() {
      var _self = this;
      $http.get(CONFIG.url + '/me/cart/')
        .success(function(data) {

          // 1: All the elements that are in the db but not in the local storage
          // version. Remove from the elements fetch from the database 
          // all the elements that are already available in db.
          for (var j = 0; j < data.length; j++) {
            data[j].frontEndId = (data[j].TrackId) ?
              'track-' + data[j].TrackId :
              'release-' + data[j].ReleaseId;
            var found = false;
            for (var i = 0; i < _self.$cart.items.length && (!found); i++) {
              if (_self.$cart.items[i]._id === data[j].frontEndId) {
                data.splice(j, 1);
                found = true;
              }
            }
          }
          // ADD BACK ALL THE ELEMENT IN THE CART 
          for (var k = 0; k < data.length; k++) {
            if (data[k].TrackId) {
              //it's a track
              _self.addItem(data[k].frontEndId,
                data[k].Track.title + '(' + data[k].Track.version + ')',
                data[k].Track.Price,
                1,
                data[k].Track);
            } else {
              //It's a release 
              _self.addItem(data[k].frontEndId,
                data[k].Release.title,
                data[k].Release.Price,
                1,
                data[k].Release);
            }
          }
          //2: TODO(bortignon) All the elements that are in the local storage
          // but not in the database. 
        });
      this.$save();
    };

    this.$restore = function(storedCart) {
      var _self = this;
      _self.init();
      _self.$cart.shipping = storedCart.shipping;
      _self.$cart.tax = storedCart.tax;
      this.$save();
    };

    this.$save = function() {
      return store.set('cart', JSON.stringify(this.getCart()));
    };

    this.getItemTotal = function(item) {
      var getTotalPricePerItem = item.getQuantity() *
        this.getConvertedPrice(item.getPrice(), item.getData());
      return +parseFloat(getTotalPricePerItem).toFixed(2);
    };
  }
])

.factory('ngCartItem', ['$rootScope', '$auth', '$http', '$log',
  function($rootScope, $auth, $http, $log) {
    var item = function(id, name, price, quantity, data) {
      this.setId(id);
      this.setName(name);
      this.setPrice(price);
      this.setQuantity(quantity);
      this.setData(data);
    };

    item.prototype.setId = function(id) {
      if (id) {
        this._id = id;
      } else {
        $log.error('An ID must be provided');
      }
    };

    item.prototype.getId = function() {
      return this._id;
    };

    item.prototype.setName = function(name) {
      if (name) {
        this._name = name;
      } else {
        $log.error('A name must be provided');
      }
    };
    item.prototype.getName = function() {
      return this._name;
    };

    item.prototype.setPrice = function(price) {
      var priceFloat = parseFloat(price);
      if (priceFloat < 0) {
        $log.error('A price must be over 0');
      } else {
        this._price = (priceFloat);
      }
    };
    item.prototype.getPrice = function() {
      return this._price;
    };

    item.prototype.setQuantity = function(quantity, relative) {
      var quantityInt = parseInt(quantity);
      if (quantityInt % 1 === 0) {
        if (relative === true) {
          this._quantity += quantityInt;
        } else {
          this._quantity = quantityInt;
        }
      } else {
        this._quantity = 1;
        $log.info('Quantity must be an integer and was defaulted to 1');
      }
      $rootScope.$broadcast('ngCart:change', {});
    };

    item.prototype.getQuantity = function() {
      return this._quantity;
    };

    item.prototype.setData = function(data) {
      if (data) {
        this._data = data;
      }
    };

    item.prototype.getData = function() {
      if (this._data) {
        return this._data;
      } else {
        $log.info('This item has no data');
      }
    };
    item.prototype.toObject = function() {
      return {
        id: this.getId(),
        name: this.getName(),
        price: this.getPrice(),
        quantity: this.getQuantity(),
        data: this.getData(),
        total: this.getTotal()
      };
    };
    return item;
  }
])

.service('store', ['$window',
  function($window) {

    return {
      get: function(key) {
        if ($window.localStorage[key]) {
          var cart = angular.fromJson($window.localStorage[key]);
          return JSON.parse(cart);
        }
        return false;
      },

      set: function(key, val) {
        if (val === undefined) {
          $window.localStorage.removeItem(key);
        } else {
          $window.localStorage[key] = angular.toJson(val);
        }
        return $window.localStorage[key];
      }
    };
  }
])

.controller('CartController', ['$scope', 'ngCart',
  function($scope, ngCart) {
    $scope.ngCart = ngCart;

  }
])

.value('version', '0.0.3-rc.1');

angular.module('ngCart.directives', ['ngCart.fulfilment'])

.controller('CartController', ['$scope', 'ngCart',
  function($scope, ngCart) {
    $scope.ngCart = ngCart;
  }
])

.directive('ngcartAddtocart', ['ngCart',
    function(ngCart) {
      return {
        restrict: 'E',
        controller: 'CartController',
        scope: {
          id: '@',
          name: '@',
          quantity: '@',
          quantityMax: '@',
          price: '@',
          data: '='
        },
        transclude: true,
        templateUrl: 'tpl/cart/addtocart.html',
        link: function(scope, element, attrs) {
          scope.attrs = attrs;
          scope.inCart = function() {
            return ngCart.getItemById(attrs.id);
          };

          if (scope.inCart()) {
            scope.q = ngCart.getItemById(attrs.id).getQuantity();
          } else {
            scope.q = parseInt(scope.quantity);
          }



          scope.qtyOpt = [];
          for (var i = 1; i <= scope.quantityMax; i++) {
            scope.qtyOpt.push(i);
          }


        }

      };
    }
  ])
  .directive('ngcartIsincart', ['ngCart',
    function(ngCart) {
      return {
        restrict: 'E',
        controller: 'CartController',
        scope: {
          id: '@'
        },
        transclude: true,
        templateUrl: 'tpl/cart/isincart.html',
        link: function(scope, element, attrs) {
          scope.attrs = attrs;
          scope.inCart = function() {
            return ngCart.getItemById(attrs.id);
          };
        }

      };
    }
  ])

.directive('ngcartCart', [

    function() {
      return {
        restrict: 'E',
        controller: 'CartController',
        scope: {},
        templateUrl: 'tpl/cart/cart.html'
      };
    }
  ])
  .directive('ngcartCounter', [

    function() {
      return {
        restrict: 'E',
        controller: 'CartController',
        scope: {},
        transclude: true,
        templateUrl: 'tpl/cart/counter.html'
      };
    }
  ])

.directive('ngcartSummary', [

  function() {
    return {
      restrict: 'E',
      controller: 'CartController',
      scope: {},
      transclude: true,
      templateUrl: 'tpl/cart/summary.html'
    };
  }
])

.directive('ngcartCheckout', [

  function() {
    return {
      restrict: 'E',
      controller: ('CartController', ['$scope', 'ngCart', 'fulfilmentProvider',
        function($scope, ngCart, fulfilmentProvider) {
          $scope.ngCart = ngCart;

          $scope.checkout = function() {
            fulfilmentProvider.setService($scope.service);
            fulfilmentProvider.setSettings($scope.settings);
            var promise = fulfilmentProvider.checkout();
            console.log(promise);
          };
        }
      ]),
      scope: {
        service: '@',
        settings: '='
      },
      transclude: true,
      templateUrl: 'tpl/cart/checkout.html'
    };
  }
]);
angular.module('ngCart.fulfilment', [])
  .service('fulfilmentProvider', ['$injector',
    function($injector) {

      this._obj = {
        service: undefined,
        settings: undefined
      };

      this.setService = function(service) {
        this._obj.service = service;
      };

      this.setSettings = function(settings) {
        this._obj.settings = settings;
      };

      this.checkout = function() {
        var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
        return provider.checkout(this._obj.settings);

      };

    }
  ])

.service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart',
  function($q, $log, ngCart) {
    this.checkout = function() {
      var deferred = $q.defer();
      $log.info(ngCart.toObject());
      deferred.resolve({
        cart: ngCart.toObject()
      });
      return deferred.promise;
    };
  }
])

.service('ngCart.fulfilment.http', ['$http', 'ngCart',
  function($http, ngCart) {
    this.checkout = function(settings) {
      return $http.post(settings.url, {
        data: ngCart.toObject()
      });
    };
  }
]);
// Not active for now.
/*
.service('ngCart.fulfilment.paypal', ['$http', 'ngCart',
  function($http, ngCart) {
  }
]);
*/
