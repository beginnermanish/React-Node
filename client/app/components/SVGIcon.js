import React from 'react';

class SVGIcon extends React.Component {

    _mergeStyles(...args) {
        return Object.assign({}, ...args);
    }
    renderGraphic() {
        switch (this.props.icon) {
            case 'add-circle-outline':
                return (
                    <g><path d="M13 7h-2v4h-4v2h4v4h2v-4h4v-2h-4v-4zm-1-5c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></g>
                );
            case 'restore':
                return (
                    <g><path d="M13 3c-4.97 0-9 4.03-9 9h-3l3.89 3.89.07.14 4.04-4.03h-3c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42c1.63 1.63 3.87 2.64 6.36 2.64 4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08v-4.25h-1.5z"></path></g>
                );
            case 'delete':
                return (
                    <g><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-12h-12v12zm13-15h-3.5l-1-1h-5l-1 1h-3.5v2h14v-2z"></path></g>
                )
        }
    }
    render() {
        let styles = {
            fill: "currentcolor",
            verticalAlign: "middle",
            width: this.props.size,     /*** CSS instead of the width attr to support non-pixel units ***/
            height: this.props.size     /*** Prevents scaling issue in IE ***/
        };
        return (
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet"
                style={this._mergeStyles(
                    styles,
                    this.props.style    /*** This lets the parent pass custom styles ***/
                )}>
                {this.renderGraphic()}
            </svg>
        );
    }
}
SVGIcon.contextTypes = {

}
SVGIcon.defaultProps = {
    icon: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    style: React.PropTypes.object
}
export default SVGIcon;