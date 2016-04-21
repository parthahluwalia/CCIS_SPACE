'use strict';

angular
    .module('booking')
    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, selectedBooking, BookingService) {
        console.log('ModalInstanceCtrl called!!!', selectedBooking, null, 2);

  /*$scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };*/
        $scope.selectedBooking = selectedBooking;

        $scope.ok = function () {
          $uibModalInstance.close($scope.selectedBooking);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });