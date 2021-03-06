'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    ['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(

    function($stateProvider, $urlRouterProvider, JQ_CONFIG) {

      $urlRouterProvider
        .otherwise('music/home');
      $stateProvider
        .state('app', {
          abstract: true,
          url: '/app',
          templateUrl: 'tpl/app.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {

                return $ocLazyLoad.load([
                  'toaster',
                  'js/controllers/headerMusic.js',
                  'js/controllers/headerAdmin.js',
                  'js/controllers/adminCompanies.js'
                ]);

              }
            ]
          }
        })
        .state('app.dashboard-v1', {
          url: '/admin',
          templateUrl: 'tpl/app_dashboard_v1.html',
          resolve: {
            authenticated: function($location, $auth, Account) {
                if (!$auth.isAuthenticated()) {
                  //not logged in 
                  //              return $location.path('/login');
                } else {
                  // with an autentication 
                  return Account.getProfile()
                    .success(function(data) {
                      if (!data.isAdmin) // Non sono autorizzato
                        return $location.path('/noPermission');
                    })

                } // if then else
              } // end of auth
              ,
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load(['js/controllers/chart.js', 'js/controllers/headerAdmin.js', ]);
              }
            ]
          }

        })
        .state('app.dashboard-v2', {
          url: '/dashboard-v2',
          templateUrl: 'tpl/app_dashboard_v2.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load(['js/controllers/chart.js']);
              }
            ]
          }
        }).state('app.admincompanies', {
          url: '/adminCompanies',
          templateUrl: 'tpl/admin/admin_companies.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([

                  'js/controllers/chart.js',
                  'js/controllers/adminCompanies.js'
                ]);
              }
            ]
          }
        }).state('app.adminlabels', {
          url: '/adminLabels',
          templateUrl: 'tpl/admin/admin_labels.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([

                  'js/controllers/chart.js',
                  'js/controllers/adminLabels.js'
                ]);
              }
            ]
          }
        }).state('app.companieslist', {
          url: '/companiesList',
          templateUrl: 'tpl/admin/companies_list.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([

                  'js/controllers/chart.js',
                  'js/controllers/companiesList.js'
                ]);
              }
            ]
          }
        }).state('app.adminlabel', {
          url: '/adminLabel/{id:int}',
          templateUrl: 'tpl/admin/admin_label.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('angularFileUpload').then(
                  function() {
                    return $ocLazyLoad.load([

                      'js/controllers/chart.js',
                      'js/controllers/adminLabel.js'
                    ]);
                  }
                );
              }
            ]
          }
        }).state('app.dropzone', {
          url: '/dropZone/{id:int}',
          templateUrl: 'tpl/admin/admin_dropzone.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('angularFileUpload').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/adminDropzone.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.admincreaterelease', {
          url: '/createRelease/{labelId:int}',
          templateUrl: 'tpl/admin/admin_edit_release.html',
          resolve: {
            deps: ['uiLoad', '$ocLazyLoad',
              function(uiLoad, $ocLazyLoad) {
                return uiLoad.load(JQ_CONFIG.sortable).then(function() {
                  return $ocLazyLoad.load('angularFileUpload').then(
                    function() {
                      return $ocLazyLoad.load('toaster').then(
                        function() {
                          return $ocLazyLoad.load([

                            'js/controllers/chart.js',
                            'js/controllers/adminEditRelease.js'
                          ]);
                        }
                      );

                    })

                });
              }
            ]
          }
        })
        .state('app.admineditrelease', {
          url: '/adminEditRelease/{id:int}',
          templateUrl: 'tpl/admin/admin_edit_release.html',
          resolve: {
            deps: ['uiLoad', '$ocLazyLoad',
              function(uiLoad, $ocLazyLoad) {
                return uiLoad.load(JQ_CONFIG.sortable).then(function() {
                  return $ocLazyLoad.load('angularFileUpload').then(
                    function() {
                      return $ocLazyLoad.load('toaster').then(
                        function() {
                          return $ocLazyLoad.load([

                            'js/controllers/chart.js',
                            'js/controllers/adminEditRelease.js'
                          ]);
                        }
                      );

                    })

                });
              }
            ]
          }
        })
        .state('app.adminrelease', {
          url: '/adminRelease/{id:int}',
          templateUrl: 'tpl/admin/admin_release.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('angularFileUpload').then(
                  function() {
                    return $ocLazyLoad.load([

                      'js/controllers/chart.js',
                      'js/controllers/adminRelease.js'
                    ]);
                  }
                );
              }
            ]
          }
        })
        .state('app.admincompany', {
          url: '/adminCompany/{id:int}',
          templateUrl: 'tpl/admin/admin_company.html',
          resolve: {
            deps: ['$ocLazyLoad',




              function($ocLazyLoad) {
                return $ocLazyLoad.load('angularFileUpload').then(
                  function() {
                    return $ocLazyLoad.load([

                      'js/controllers/chart.js',
                      'js/controllers/adminCompany.js'
                    ]);
                  }
                );
              }
            ]
          }
        }).state('app.admingenres', {
          url: '/adminGenres',
          templateUrl: 'tpl/admin/admin_genres.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/chart.js',
                  'js/controllers/adminGenres.js'
                ]);
              }
            ]
          }
        }).state('app.adminartists', {
          url: '/adminArtists',
          templateUrl: 'tpl/admin/admin_artists.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/chart.js',
                  'js/controllers/adminArtists.js'
                ]);
              }
            ]
          }
        }).state('app.admincurrencies', {
          url: '/adminCurrencies',
          templateUrl: 'tpl/admin/admin_currencies.html',

          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('xeditable').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/adminCurrencies.js');
                  }
                );
              }
            ]
          }
        }).state('app.artisteditlist', {
          url: '/editArtists',
          templateUrl: 'tpl/admin.edit.artist.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/adminEditArtist.js'
                ]);
              }
            ]
          }
        })
        .state('app.admineditprofile', {
          url: '/adminEditArtistProfile/{id:int}',
          templateUrl: 'tpl/admin/admin_artist_profile.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('angularFileUpload').then(
                  function() {
                    return $ocLazyLoad.load([

                      'js/controllers/chart.js',
                      'js/controllers/adminEditArtistProfile.js'
                    ]);
                  }
                );
              }
            ]
          }
        })

      .state('app.ui', {
          url: '/ui',
          template: '<div ui-view class="fade-in-up"></div>'
        })
        .state('app.ui.buttons', {
          url: '/buttons',
          templateUrl: 'tpl/ui_buttons.html'
        })
        .state('app.ui.icons', {
          url: '/icons',
          templateUrl: 'tpl/ui_icons.html'
        })
        .state('app.ui.grid', {
          url: '/grid',
          templateUrl: 'tpl/ui_grid.html'
        })
        .state('app.ui.widgets', {
          url: '/widgets',
          templateUrl: 'tpl/ui_widgets.html'
        })
        .state('app.ui.bootstrap', {
          url: '/bootstrap',
          templateUrl: 'tpl/ui_bootstrap.html'
        })
        .state('app.ui.sortable', {
          url: '/sortable',
          templateUrl: 'tpl/ui_sortable.html'
        })
        .state('app.ui.scroll', {
          url: '/scroll',
          templateUrl: 'tpl/ui_scroll.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load('js/controllers/scroll.js');
              }
            ]
          }
        })
        .state('app.ui.portlet', {
          url: '/portlet',
          templateUrl: 'tpl/ui_portlet.html'
        })
        .state('app.ui.timeline', {
          url: '/timeline',
          templateUrl: 'tpl/ui_timeline.html'
        })
        .state('app.ui.tree', {
          url: '/tree',
          templateUrl: 'tpl/ui_tree.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('angularBootstrapNavTree').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/tree.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.ui.toaster', {
          url: '/toaster',
          templateUrl: 'tpl/ui_toaster.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('toaster').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/toaster.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.ui.jvectormap', {
          url: '/jvectormap',
          templateUrl: 'tpl/ui_jvectormap.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('js/controllers/vectormap.js');
              }
            ]
          }
        })
        .state('app.ui.googlemap', {
          url: '/googlemap',
          templateUrl: 'tpl/ui_googlemap.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load([
                  'js/app/map/load-google-maps.js',
                  'js/app/map/ui-map.js',
                  'js/app/map/map.js'
                ]).then(
                  function() {
                    return loadGoogleMaps();
                  }
                );
              }
            ]
          }
        })
        .state('app.chart', {
          url: '/chart',
          templateUrl: 'tpl/ui_chart.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load('js/controllers/chart.js');
              }
            ]
          }
        })
        // table
        .state('app.table', {
          url: '/table',
          template: '<div ui-view></div>'
        })
        .state('app.table.static', {
          url: '/static',
          templateUrl: 'tpl/table_static.html'
        })
        .state('app.table.datatable', {
          url: '/datatable',
          templateUrl: 'tpl/table_datatable.html'
        })
        .state('app.table.footable', {
          url: '/footable',
          templateUrl: 'tpl/table_footable.html'
        })
        .state('app.table.grid', {
          url: '/grid',
          templateUrl: 'tpl/table_grid.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('ngGrid').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/grid.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.table.uigrid', {
          url: '/uigrid',
          templateUrl: 'tpl/table_uigrid.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('ui.grid').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/uigrid.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.table.editable', {
          url: '/editable',
          templateUrl: 'tpl/table_editable.html',
          controller: 'XeditableCtrl',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('xeditable').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/xeditable.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.table.smart', {
          url: '/smart',
          templateUrl: 'tpl/table_smart.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('smart-table').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/table.js');
                  }
                );
              }
            ]
          }
        })
        // form
        .state('app.form', {
          url: '/form',
          template: '<div ui-view class="fade-in"></div>',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load('js/controllers/form.js');
              }
            ]
          }
        })
        .state('app.form.components', {
          url: '/components',
          templateUrl: 'tpl/form_components.html',
          resolve: {
            deps: ['uiLoad', '$ocLazyLoad',
              function(uiLoad, $ocLazyLoad) {
                return uiLoad.load(JQ_CONFIG.daterangepicker)
                  .then(
                    function() {
                      return uiLoad.load('js/controllers/form.components.js');
                    }
                  ).then(
                    function() {
                      return $ocLazyLoad.load('ngBootstrap');
                    }
                  );
              }
            ]
          }
        })
        .state('app.form.elements', {
          url: '/elements',
          templateUrl: 'tpl/form_elements.html'
        })
        .state('app.form.validation', {
          url: '/validation',
          templateUrl: 'tpl/form_validation.html'
        })
        .state('app.form.wizard', {
          url: '/wizard',
          templateUrl: 'tpl/form_wizard.html'
        })
        .state('app.form.fileupload', {
          url: '/fileupload',
          templateUrl: 'tpl/form_fileupload.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('angularFileUpload').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/file-upload.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.form.imagecrop', {
          url: '/imagecrop',
          templateUrl: 'tpl/form_imagecrop.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('ngImgCrop').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/imgcrop.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.form.select', {
          url: '/select',
          templateUrl: 'tpl/form_select.html',
          controller: 'SelectCtrl',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('ui.select').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/select.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.form.slider', {
          url: '/slider',
          templateUrl: 'tpl/form_slider.html',
          controller: 'SliderCtrl',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('vr.directives.slider').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/slider.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.form.editor', {
          url: '/editor',
          templateUrl: 'tpl/form_editor.html',
          controller: 'EditorCtrl',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('textAngular').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/editor.js');
                  }
                );
              }
            ]
          }
        })
        .state('app.form.xeditable', {
          url: '/xeditable',
          templateUrl: 'tpl/form_xeditable.html',
          controller: 'XeditableCtrl',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load('xeditable').then(
                  function() {
                    return $ocLazyLoad.load('js/controllers/xeditable.js');
                  }
                );
              }
            ]
          }
        })
        // pages
        .state('app.page', {
          url: '/page',
          template: '<div ui-view class="fade-in-down"></div>'
        })
        .state('app.page.profile', {
          url: '/profile',
          templateUrl: 'tpl/page_profile.html'
        })
        .state('app.page.post', {
          url: '/post',
          templateUrl: 'tpl/page_post.html'
        })
        .state('app.page.search', {
          url: '/search',
          templateUrl: 'tpl/page_search.html'
        })
        .state('app.page.invoice', {
          url: '/invoice',
          templateUrl: 'tpl/page_invoice.html'
        })
        .state('app.page.price', {
          url: '/price',
          templateUrl: 'tpl/page_price.html'
        })
        .state('app.docs', {
          url: '/docs',
          templateUrl: 'tpl/docs.html'
        })
        // others
        .state('lockme', {
          url: '/lockme',
          templateUrl: 'tpl/page_lockme.html'
        })
        .state('access', {
          url: '/access',
          template: '<div ui-view class="fade-in-right-big smooth"></div>'
        })
        .state('access.signin', {
          url: '/signin',
          templateUrl: 'tpl/page_signin.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/controllers/signin.js']);
              }
            ]
          }
        })
        .state('access.signup', {
          url: '/signup',
          templateUrl: 'tpl/page_signup.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/controllers/signup.js']);
              }
            ]
          }
        })
        .state('logout', {
          url: '/logout',
          templateUrl: 'tpl/logout.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/controllers/logout.js']);
              }
            ]
          }
        })

      .state('access.forgotpwd', {
          url: '/forgotpwd',
          templateUrl: 'tpl/page_forgotpwd.html'
        })
        .state('access.404', {
          url: '/404',
          templateUrl: 'tpl/page_404.html'
        })

      // fullCalendar
      .state('app.calendar', {
        url: '/calendar',
        templateUrl: 'tpl/app_calendar.html',
        // use resolve to load other dependences
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return uiLoad.load(
                JQ_CONFIG.fullcalendar.concat('js/app/calendar/calendar.js')
              ).then(
                function() {
                  return $ocLazyLoad.load('ui.calendar');
                }
              )
            }
          ]
        }
      })

      // mail
      .state('app.mail', {
          abstract: true,
          url: '/mail',
          templateUrl: 'tpl/mail.html',
          // use resolve to load other dependences
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/app/mail/mail.js',
                  'js/app/mail/mail-service.js',
                  JQ_CONFIG.moment
                ]);
              }
            ]
          }
        })
        .state('app.mail.list', {
          url: '/inbox/{fold}',
          templateUrl: 'tpl/mail.list.html'
        })
        .state('app.mail.detail', {
          url: '/{mailId:[0-9]{1,4}}',
          templateUrl: 'tpl/mail.detail.html'
        })
        .state('app.mail.compose', {
          url: '/compose',
          templateUrl: 'tpl/mail.new.html'
        })

      .state('layout', {
          abstract: true,
          url: '/layout',
          templateUrl: 'tpl/layout.html'
        })
        .state('layout.fullwidth', {
          url: '/fullwidth',
          views: {
            '': {
              templateUrl: 'tpl/layout_fullwidth.html'
            },
            'footer': {
              templateUrl: 'tpl/layout_footer_fullwidth.html'
            }
          },
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/controllers/vectormap.js']);
              }
            ]
          }
        })
        .state('layout.mobile', {
          url: '/mobile',
          views: {
            '': {
              templateUrl: 'tpl/layout_mobile.html'
            },
            'footer': {
              templateUrl: 'tpl/layout_footer_mobile.html'
            }
          }
        })
        .state('layout.app', {
          url: '/app',
          views: {
            '': {
              templateUrl: 'tpl/layout_app.html'
            },
            'footer': {
              templateUrl: 'tpl/layout_footer_fullwidth.html'
            }
          },
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/controllers/tab.js']);
              }
            ]
          }
        })
        .state('apps', {
          abstract: true,
          url: '/apps',
          templateUrl: 'tpl/layout.html'
        })
        .state('apps.note', {
          url: '/note',
          templateUrl: 'tpl/apps_note.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/app/note/note.js',
                  JQ_CONFIG.moment
                ]);
              }
            ]
          }
        })
        .state('apps.contact', {
          url: '/contact',
          templateUrl: 'tpl/apps_contact.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/app/contact/contact.js']);
              }
            ]
          }
        })
        .state('app.weather', {
          url: '/weather',
          templateUrl: 'tpl/apps_weather.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load({
                  name: 'angular-skycons',
                  files: ['js/app/weather/skycons.js',
                    'js/app/weather/angular-skycons.js',
                    'js/app/weather/ctrl.js',
                    JQ_CONFIG.moment
                  ]
                });
              }
            ]
          }
        })
        .state('app.todo', {
          url: '/todo',
          templateUrl: 'tpl/apps_todo.html',
          resolve: {
            deps: ['uiLoad',
              function(uiLoad) {
                return uiLoad.load(['js/app/todo/todo.js',
                  JQ_CONFIG.moment
                ]);
              }
            ]
          }
        })
        .state('app.todo.list', {
          url: '/{fold}'
        })
        .state('music', {
          url: '/music',
          templateUrl: 'tpl/music.html',
          controller: 'MusicCtrl',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'com.2fdevs.videogular',
                  'com.2fdevs.videogular.plugins.controls',
                  'com.2fdevs.videogular.plugins.overlayplay',
                  'com.2fdevs.videogular.plugins.poster',
                  'com.2fdevs.videogular.plugins.buffering',
                  'js/app/music/ctrl.js',
                  'js/controllers/headerMusic.js',
                  'js/app/music/theme.css'
                ]);
              }
            ]
          }
        })
        .state('music.home', {
          url: '/home',
          templateUrl: 'tpl/music.home.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {

                return $ocLazyLoad.load([
                  'toaster',
                  'js/controllers/homePage.js'
                ]);

              }
            ]
          }
        }).state('music.release', {
          url: '/release/{id:int}',
          templateUrl: 'tpl/music.release.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/libs/cart/ngCart.js',
                  'js/controllers/release.js'
                ]);
              }
            ]
          }
        }).state('music.library', {
          url: '/library',
          templateUrl: 'tpl/music.library.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/library.js'
                ]);
              }
            ]
          }
        }).state('music.cart', {
          url: '/cart',
          templateUrl: 'tpl/cart.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/cart.js'
                ]);

              }
            ]
          }
        }).state('music.track', {
          url: '/track/{id:int}',
          templateUrl: 'tpl/music.track.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/track.js',
                  'js/libs/waveform/waveform.js'
                ]);

              }
            ]
          }
        }).state('music.artist', {
          url: '/artist/{id:int}',
          templateUrl: 'tpl/music.artist.html',
          resolve: {
            deps: ['$ocLazyLoad',
              function($ocLazyLoad) {
                return $ocLazyLoad.load([
                  'js/controllers/artist.js'
                ]);

              }
            ]
          }
        })
        .state('music.genres', {
          url: '/genres',
          templateUrl: 'tpl/music.genres.html'
        })
        .state('music.detail', {
          url: '/detail',
          templateUrl: 'tpl/music.detail.html'
        })
        .state('music.mtv', {
          url: '/mtv',
          templateUrl: 'tpl/music.mtv.html'
        })
        .state('music.mtvdetail', {
          url: '/mtvdetail',
          templateUrl: 'tpl/music.mtv.detail.html'
        })
        .state('music.playlist', {
          url: '/playlist/{fold}',
          templateUrl: 'tpl/music.playlist.html'
        })
    }

  );
