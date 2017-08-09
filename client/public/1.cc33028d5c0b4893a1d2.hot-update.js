webpackHotUpdate(1,{

/***/ 1321:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(10), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(9), React = __webpack_require__(1); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _Auth = __webpack_require__(43);
	
	var _Auth2 = _interopRequireDefault(_Auth);
	
	var _reactRouter = __webpack_require__(59);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var EnsureLoggedInContainer = function (_React$Component) {
	    _inherits(EnsureLoggedInContainer, _React$Component);
	
	    function EnsureLoggedInContainer() {
	        _classCallCheck(this, EnsureLoggedInContainer);
	
	        return _possibleConstructorReturn(this, (EnsureLoggedInContainer.__proto__ || Object.getPrototypeOf(EnsureLoggedInContainer)).apply(this, arguments));
	    }
	
	    _createClass(EnsureLoggedInContainer, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            if (!this.isLoggedIn()) {
	                _Auth2.default.deauthenticateUser();
	                localStorage.clear();
	                this.context.router.replace('/login');
	                if (window.cordova && navigator && navigator.app) {
	                    navigator.app.exitApp();
	                }
	            }
	        }
	    }, {
	        key: 'isLoggedIn',
	        value: function isLoggedIn() {
	            var toReturn = false;
	            toReturn = _Auth2.default.isUserAuthenticated();
	            return toReturn;
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            if (this.isLoggedIn()) {
	                return this.props.children;
	            } else {
	                return null;
	            }
	        }
	    }]);
	
	    return EnsureLoggedInContainer;
	}(_react2.default.Component);
	
	EnsureLoggedInContainer.contextTypes = {
	    router: _react2.default.PropTypes.object.isRequired
	};
	
	exports.default = EnsureLoggedInContainer;
	
	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(12); if (makeExportsHot(module, __webpack_require__(1))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "EnsureLoggedInContainer.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module)))

/***/ }

})
//# sourceMappingURL=1.cc33028d5c0b4893a1d2.hot-update.js.map