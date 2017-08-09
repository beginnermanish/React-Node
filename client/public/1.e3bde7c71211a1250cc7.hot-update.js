webpackHotUpdate(1,{

/***/ 1324:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, $, jQuery) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(10), RootInstanceProvider = __webpack_require__(11), ReactMount = __webpack_require__(9), React = __webpack_require__(1); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactBootstrap = __webpack_require__(206);
	
	var _reactRouter = __webpack_require__(59);
	
	var _Auth = __webpack_require__(43);
	
	var _Auth2 = _interopRequireDefault(_Auth);
	
	var _Helpers = __webpack_require__(215);
	
	var _util = __webpack_require__(84);
	
	var _util2 = _interopRequireDefault(_util);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Navigation = _react2.default.createClass({
	    displayName: 'Navigation',
	
	    getInitialState: function getInitialState(props) {
	        this.state = this.state ? this.state : {};
	        this.state.menuItems = this.state.menuItems ? this.state.menuItems : [];
	        return this.state;
	    },
	    componentWillMount: function componentWillMount() {
	        if (localStorage.menuData) {
	            var data = JSON.parse(localStorage.menuData);
	            this.state.menuItems = data;
	        }
	    },
	    componentDidMount: function componentDidMount() {
	        var menu = this.refs.menu;
	
	        $(menu).metisMenu();
	    },
	
	    componentDidUpdate: function componentDidUpdate() {
	        var menu = this.refs.menu;
	
	        $(menu).metisMenu();
	    },
	
	    activeRoute: function activeRoute(routeName) {
	        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
	    },
	    secondLevelActive: function secondLevelActive(routeName) {
	        return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
	    },
	    onMenuItemClick: function onMenuItemClick(path, contaxt) {
	        path = path.toLowerCase();
	        this.context.router.push('/' + path);
	    },
	    onMainIconClick: function onMainIconClick() {
	        this.context.router.push('/main');
	    },
	    onLogOut: function onLogOut() {
	        _Auth2.default.deauthenticateUser();
	        _reactRouter.browserHistory.push('#/login');
	        localStorage.clear();
	
	        if (window.cordova && navigator && navigator.app) {
	            navigator.app.exitApp();
	        }
	    },
	    toggleNavigation: function toggleNavigation(e) {
	        if (jQuery(window).width() <= 768) {
	            $("body").toggleClass("mini-navbar");
	            if ($("body").hasClass("mini-navbar")) {
	                $("body").removeClass('cust-fix-titlebar');
	            } else {
	                $("body").addClass('cust-fix-titlebar');
	            }
	            (0, _Helpers.smoothlyMenu)();
	        }
	    },
	    render: function render() {
	        var menus = this.state.menuItems;
	        var me = this;
	        return _react2.default.createElement(
	            'nav',
	            { className: 'navbar-default navbar-static-side', role: 'navigation' },
	            _react2.default.createElement(
	                'div',
	                { className: 'sidebar-collapse' },
	                _react2.default.createElement('img', { src: _util2.default.getImageSrc("img/logo.png"), className: 'header-logo', onClick: this.onMainIconClick }),
	                _react2.default.createElement(
	                    'ul',
	                    { className: 'nav metismenu', id: 'side-menu', ref: 'menu' },
	                    _react2.default.createElement(
	                        'li',
	                        { className: 'nav-header text-center' },
	                        _react2.default.createElement(
	                            'div',
	                            { className: 'dropdown profile-element' },
	                            _react2.default.createElement(
	                                'a',
	                                { className: 'dropdown-toggle' },
	                                _react2.default.createElement(
	                                    'span',
	                                    { className: 'clear' },
	                                    _react2.default.createElement(
	                                        'span',
	                                        { className: 'block m-t-xs' },
	                                        ' ',
	                                        _react2.default.createElement(
	                                            'strong',
	                                            { className: 'font-bold' },
	                                            'TRAC-ON'
	                                        )
	                                    )
	                                )
	                            )
	                        ),
	                        _react2.default.createElement(
	                            'div',
	                            { className: 'logo-element' },
	                            'Trac On'
	                        )
	                    ),
	                    menus.length > 0 ? menus.map(function (menuItem, index) {
	                        var isChild = false;
	                        var subMenuItems = menuItem.items;
	                        if (subMenuItems != null && subMenuItems.length > 0) {
	                            isChild = true;
	                        }
	
	                        if (!isChild) {
	
	                            return _react2.default.createElement(
	                                'li',
	                                { key: index, className: this.activeRoute("/" + menuItem.label) },
	                                _react2.default.createElement(
	                                    _reactRouter.Link,
	                                    { to: "/" },
	                                    _react2.default.createElement(
	                                        'i',
	                                        null,
	                                        _react2.default.createElement('img', { src: _util2.default.getImageSrc('img/menu-icons/' + menuItem.item.Icon_file + "_16.png") })
	                                    ),
	                                    _react2.default.createElement(
	                                        'span',
	                                        { className: 'nav-label' },
	                                        menuItem.Caption
	                                    )
	                                )
	                            );
	                        } else {
	                            return _react2.default.createElement(
	                                'li',
	                                { key: index, className: this.activeRoute("/" + menuItem.label) },
	                                _react2.default.createElement(
	                                    _reactRouter.Link,
	                                    { to: "/", onClick: this.onMenuItemClick.bind(this, menuItem.label) },
	                                    _react2.default.createElement(
	                                        'i',
	                                        null,
	                                        _react2.default.createElement('img', { src: _util2.default.getImageSrc('img/menu-icons/' + menuItem.item.Icon_file + "_16.png") })
	                                    ),
	                                    _react2.default.createElement(
	                                        'span',
	                                        { className: 'nav-label' },
	                                        menuItem.Caption
	                                    ),
	                                    ' ',
	                                    _react2.default.createElement('span', { className: 'fa arrow' })
	                                ),
	                                _react2.default.createElement(
	                                    'ul',
	                                    { className: this.secondLevelActive("/" + menuItem.label) },
	                                    subMenuItems.map(function (submenuItem, index1) {
	                                        if (submenuItem.item.Name) {
	                                            return _react2.default.createElement(
	                                                'li',
	                                                { key: index1, className: this.activeRoute("/" + submenuItem.item.Name.toLowerCase()) },
	                                                _react2.default.createElement(
	                                                    _reactRouter.Link,
	                                                    { onClick: this.toggleNavigation, to: "/" + submenuItem.item.Menu_name.toLowerCase() + "/" + submenuItem.item.Name.toLowerCase().replace(" ", "-") },
	                                                    _react2.default.createElement(
	                                                        'i',
	                                                        null,
	                                                        _react2.default.createElement('img', { src: _util2.default.getImageSrc('img/menu-icons/' + submenuItem.item.Icon_file + "_16.png") })
	                                                    ),
	                                                    _react2.default.createElement(
	                                                        'span',
	                                                        { className: 'nav-label' },
	                                                        submenuItem.item.Caption
	                                                    )
	                                                )
	                                            );
	                                        }
	                                    }, this)
	                                )
	                            );
	                        }
	                    }, this) : null,
	                    _react2.default.createElement(
	                        'li',
	                        { className: this.activeRoute("/logout") },
	                        _react2.default.createElement(
	                            _reactRouter.Link,
	                            { to: "/", onClick: this.onLogOut },
	                            _react2.default.createElement('i', { className: 'fa fa-sign-out' }),
	                            _react2.default.createElement(
	                                'span',
	                                { className: 'nav-label' },
	                                'Logout'
	                            )
	                        )
	                    ),
	                    ')'
	                )
	            )
	        );
	    }
	});
	
	Navigation.contextTypes = {
	    router: _react2.default.PropTypes.object.isRequired
	};
	
	exports.default = Navigation;
	
	/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(12); if (makeExportsHot(module, __webpack_require__(1))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "Navigation.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module), __webpack_require__(26), __webpack_require__(26)))

/***/ }

})
//# sourceMappingURL=1.e3bde7c71211a1250cc7.hot-update.js.map