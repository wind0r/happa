'use strict';
var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Slide = require('../component_slider/slide');
var actions = require('../reflux_actions/new_service_actions');
var store = require('../reflux_stores/new_service_store');
var Reflux = require('reflux');
var _ = require('underscore');

module.exports = React.createClass ({
    mixins: [Reflux.connect(store,'newService')],

    componentDidMount: function() {
      this.listenTo(actions.analyzeImage.completed, this.onAnalyzeImageCompleted);
    },

    onAnalyzeImageCompleted: function(imageName) {
      this.continueIfAllImagesDone();
    },

    onPrevious: function() {
      clearTimeout(this.continueTimeout);
      this.props.onPrevious();
    },

    continueIfAllImagesDone: function() {
      var allImagesDone = _.every(this.state.newService.images, function(image) {
        return image.analyzeStatus === "DONE";
      });

      if (allImagesDone) {
        // Allow the progress bar to reach the end
        // before transitioning automatically to the next step
        this.continueTimeout = setTimeout(this.props.onContinue, 500);
      }
    },

    retryAnalyze: function(imageName) {
      actions.analyzeImage(imageName);
    },

    render() {
        return (
          <Slide>
            <h1>Analyzing images</h1>
            {
              this.state.newService.images.map(function(image){
                return (
                  <div className={"image_analyze_progress--container "  + image.analyzeStatus} key={image.name}>
                    <div onClick={this.retryAnalyze.bind(this, image.name)} className="image_analyze_progress--label">{image.name} - {image.analyzeStatus}</div>
                    <ReactCSSTransitionGroup transitionName="slide-left" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
                    {
                      image.analyzeStatus === "STARTED" ? <img className="loader" src="/images/loader_oval_light.svg" /> : null
                    }
                    </ReactCSSTransitionGroup>
                    <div className="image_analyze_progress--bar-container">
                      <div className="image_analyze_progress--bar-border"></div>
                      <div className="image_analyze_progress--bar-background"></div>
                      <div className="image_analyze_progress--bar" style={{width: image.analyzeProgress + "%"}}>
                      </div>
                    </div>

                    <pre>
                      {
                        image.analyzeError ? image.analyzeError.error : null
                      }
                    </pre>
                  </div>
                );
              }.bind(this))
            }

            <button className="primary" onClick={this.props.onContinue}>Continue</button><br/>
            <button onClick={this.onPrevious}>Previous</button>
          </Slide>
        );
    }
});