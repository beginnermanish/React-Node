import React, { Component } from 'react';
import frameUrl from '../../util/index';

class IFrame extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    iframe() {
        var path = this.props.location.pathname.replace('/', '').toLowerCase();
        var url = frameUrl.getIframeUrl(path);
        if (!url) {
            console.log('Page Path for add moodle: - ' + path);
        }

        return {
            __html: '<iframe src="' + url + '" frameborder="0" width="100%" height="100%"></iframe>'
        }
    }

    render() {

        return (
            <div className="wrapper wrapper-content mt0">
                <div className="row">
                    <div dangerouslySetInnerHTML={this.iframe()} />
                </div>
            </div>
        )
    }
};

IFrame.contextTypes = {
    router: React.PropTypes.object.isRequired
};
export default IFrame