//alert("out "+localStorage.UserName);

if (localStorage.UserName==null || localStorage.UserName==undefined) {
	window.location = '/#/login';
} else{
	window.location = '/#/dashboard/home';
};

// app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
//     $rootScope.$on('$routeChangeStart', function (event) {

//         if (!Auth.isLoggedIn()) {
//             console.log('DENY');
//             event.preventDefault();
//             $location.path('/login');
//         }
//         else {
//             console.log('ALLOW');
//             $location.path('/home');
//         }
//     });
// }]);