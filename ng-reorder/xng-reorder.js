angular.module('xng', []).directive("reorder", function() {
    var arrayMap = [];
    return {
        restrict : 'E',
        template : '<table><tr><td style="vertical-align: middle;"><span>{{index}}&nbsp;to&nbsp;</span><select style="text-align: right;margin-right: 1em;width: 1.5em;" ng-model="index" ng-options="possibleIndex as possibleIndex for possibleIndex in possibleIndices" ng-change="reorder()"></td><td style="vertical-align: top;"></select><span ng-transclude></span></td></tr></table>',
        transclude : true,
        scope : {
            last : '@',
            array : '='
        },
        controller : function($scope, $element, $attrs, $filter, $rootScope) {
            $scope.$on("REINDEX", function(event, arg) {
                if (arg.array === $scope.array) {
                    for (var index = 0; index < arg.mapArray.length; index++) {
                        var mapEntry = arg.mapArray[index];
                        if (""+self.i === ""+mapEntry.i) {
                            $scope.index = mapEntry.index;
                            self.i = index;
                            self.index = index;
                            var possibleIndices = [];
                            for (var iii = 0; iii < $scope.array.length; iii++) {
                                if (iii === index) {
                                    continue;
                                }
                                possibleIndices.push(""+iii);
                            }
                            $scope.possibleIndices = possibleIndices;
                            break;
                        }
                    }
                }
            });
            
            $scope.possibleIndices = [""+0];
            $scope.index = ""+0;
            var dollarIndex = $scope.$parent.$eval('$index');
            var possibleIndices = [];
            for (var iii = 0; iii < $scope.array.length; iii++) {
                if (iii === dollarIndex) {
                    continue;
                }
                possibleIndices.push(""+iii);
            }
            $scope.possibleIndices = possibleIndices;
            $scope.index = ""+$scope.$parent.$eval('$index');
            var entryForArray;
            angular.forEach(arrayMap, function(entry, index) {
                if (entry.key === $scope.array) {
                    entryForArray = entry;
                }
            });
            if (!entryForArray) {
                entryForArray = {
                    key : $scope.array,
                    indexMapArray : []
                };
                arrayMap.push(entryForArray);
            }
            var i = entryForArray.indexMapArray.length;
            var self = {i:i, index:parseInt($scope.index, 10)};
            entryForArray.indexMapArray.push(self);
            $scope.reorder = function() {
                var ni = parseInt($scope.index, 10);
                var mi =  parseInt(self.index, 10);
                if (ni < mi) {
                    ni--;
                } else {
                    ni++;
                }
                self.index = ni;
                entryForArray.indexMapArray = $filter('orderBy')(entryForArray.indexMapArray, 'index');
                var arrayCopy = angular.copy($scope.array);
                angular.forEach(entryForArray.indexMapArray, function(item, j) {
                    arrayCopy[j] = $scope.array[item.i];
                    item.index = j;
                });
                $scope.array.length = 0;
                angular.forEach(arrayCopy, function(item) {
                    $scope.array.push(item);
                });
                $rootScope.$broadcast("REINDEX", {array: $scope.array, mapArray:angular.copy(entryForArray.indexMapArray)});
            }
        }
    }
});
