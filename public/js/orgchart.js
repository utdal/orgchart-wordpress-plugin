/** Research Organizational Chart
 *
 *  requires: jQuery, Bootstrap Treeview, org_data = []
 */

var $ = jQuery.noConflict();

/**
 * Variable for media breakpoints - phone, tablet, desktop, big screen
*/
var mediaBreakpoints = {
  'small': "screen and (max-width: 767px)",
  'medium': "screen and (min-width: 768px) and (max-width: 991px)",
  'large': "screen and (min-width: 992px) and (max-width: 1199px)",
  'xl': "screen and (min-width: 1200px)",
};

/**
 * Searches the URL for named parameter and returns its value.
 * 
 * @param  {String} n query parameter to search for
 * @return {String | Boolean}   the value of the query parameter or false if not found
 */
function getParameterByName(n) {
  var match = RegExp('[?&]' + n + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

/**
 * Search the org chart.
 * 
 * @return {void}
 */
function searchOrgChart() {
  var searchfor = $('#orgchart_search_box').val();
  var options = {
    ignoreCase: true,
    exactMatch: false,
    revealResults: true,
  };

  var results = $('#orgchart').treeview('search', [searchfor, options]);

  var output = '<ol><p>' + results.length + ' matches found</p>';
  $.each(results, function (index, result) {
    output += '<li><a href="#'+ result.slug + '">' + result.name + (result.title ? ' - ' + result.title : '') + '</a></li>';
  });
  output += '</ol>';
  $('#orgchart_search_results').html(output);
}

/**
 * Clears the org chart search.
 * 
 * @return {void}
 */
function clearSearchOrgChart() {
  $('#orgchart_search_box').val('');
  $('#orgchart_search_results').html('');
  $('#orgchart').treeview('clearSearch');
}

/**
 * Event handler for searching the org chart for a tag.
 * 
 * @param  {Object} event
 * @return {void}
 */
function searchOrgChartForTag(event) {
  event.preventDefault();
  smoothlyScrollTo('#orgchart_search_box');
  $('#orgchart_search_box').val( $(this).html().trim() );
  searchOrgChart(); 
}

/**
 * Registers the org chart tag search event handler.
 * 
 * @return {void}
 */
function registerOrgChartTagSearch() {
  $('#orgchart.searchable .node-orgchart .tags .badge').off('click').on('click', searchOrgChartForTag);
}

/**
 * Gets the value of vertical depth corresponding to a new minimum depth on the scale.
 * and sets the slider value accordingly.
 * 
 * @param  {int} newLevel : the new depth level to display as the top level
 * @return {int}          : normalized new vertical depth
 */
function normalizeVerticalDepth(newLevel) {
  var $verticalDepthSlider = $('#select-vert-depth');
  var should_be_value = $verticalDepthSlider.data('should-be-value');
  var oldLevel = $('#orgchart_graphical').find('.node:first').data('level');
  var relativeLevel = newLevel - oldLevel;
  var current_depth_slider_value = (should_be_value === undefined) ? $verticalDepthSlider.val() : should_be_value;

  var selectedVerticalDepth = current_depth_slider_value - relativeLevel;

  // we shouldn't go below a vertical depth of 2
  // if we need to, let's save the real value to reapply in case we go back above 2 again
  if (selectedVerticalDepth < 2) {
    $verticalDepthSlider.data('should-be-value', selectedVerticalDepth);
    selectedVerticalDepth = 2;
  } else {
    $verticalDepthSlider.removeData('should-be-value');
  }

  // set the slider to display the new normalized vertical depth
  $verticalDepthSlider.val(selectedVerticalDepth);

  return selectedVerticalDepth;
}

/**
 * Finds an object with an id within a nested object.
 * 
 * @param  {string|int} id    : id to search for
 * @param  {Object} odata     : object to search
 * @return {Object|false}
 */
function findOrgDataObjectById(id, odata) {
  id = parseInt(id);
  if (odata.id === id) {
    return odata;
  } else if (odata.children) {
    for (var i = 0; i < odata.children.length; i++) {
      var child_val = findOrgDataObjectById(id, odata.children[i]);
      if (child_val) {
        return child_val;
      }
    }
  }

  return false;
}

/**
 * Hook for orgchart js library to add custom features for orgchart node. 
 * Adds contact info, and custom bottom edge click handler for showing all descendant nodes.
 * 
 * @param  {jQuery Object} $node      : current node within orgchart
 * @param  {Object} data              : data for individual $node 
 * @return {boolean|true}    
 */
function customCreateNode($node, data) {
  $node.data('level', data.level);          // store level in current node data
  $node.data('slug', data.slug);            // store slug in current node data

  if (data.title === '' && data.hasOwnProperty('name')) {
    $node.addClass('group');
    $node.find('.title').html('<i class="fa fa-building symbol"></i>' + data.name);
    $node.find('.content').html('');
  }

  // Add contact info 
  var contact_info = "";

  contact_info += "<div class='orgchartg-contact-info'>";

  if(data.headshot) {
    contact_info += "<div class='orgchartg-headshot'>" + data.headshot + "</div>";
  }
  else {
    contact_info += "<div class='orgchartg-headshot'>" + data.placeholderimg + "</div>";
  }

  if (data.phone) {
    contact_info += data.phone + "\n" + data.location;
  }

  if(data.phone && data.email){
    contact_info += " | ";
  }

  if (data.email) {
    contact_info += "<a href='mailto:" + data.email + "'>" + "<i class='fa fa-envelope-o symbol'></i>" + "</a>";
  }

  contact_info += "</div>";

  // if the node has either email or phone, then add secondMenu to show contact info on click
  if ( (data.phone) || (data.email) ) {

    $node.find('.content').append(contact_info);
        
    var secondMenuIcon = $('<i>', {
      'class': 'fa fa-info-circle second-menu-icon',
      click: function() {    
        $(this).siblings('.content').children('.orgchartg-contact-info').slideToggle(200);
      }
    }); // end secondMenuIcon    

    $node.append(secondMenuIcon);   // append secondMenuIcon to $node

  }    // show secondMenu end check for phone number and email

  // check for admin node
  if (data.hasOwnProperty('adjacent')) {
    if (data.adjacent) {
      $node.addClass('admin');
      $node.find('.title').html('<i class="fa fa-id-badge symbol"></i>' + data.title);
    }
  }

  // add event handler for bottom edge double click
  //  bind click event handler for the bottom edge
  $node.on('click', '.bottomEdge', function(event) {
    event.stopPropagation();
    var $orgchartContainer = $('#orgchart_graphical');
    var $that = $(this);
    var $node = $that.parent();

    // check if children exist and/or are visible
    var childrenState = $('#orgchart_graphical').orgchart('getNodeState', $node, 'children');

    if (!childrenState.exist) {
      return;
    }
      
    var $allDescendants = $node.closest('tr').siblings().last().find('.node');
        
    var $hiddenDescendants = $node.closest('tr').siblings().last().find('.slide-up');

    if (!$hiddenDescendants.length) {  // all descendants visible
      return;
    }

    var allDescendantsCount = $allDescendants.length;

    //keep track of number made visible so no unnecessarily looping over remainder nodes
    var numHiddenDescendants = $hiddenDescendants.length;   

    //loop through allDescendants list 
    // - call getNodeState($node,'children') on each object from allDescendants list
    // - use .eq - returns jQuery object, (don't use .get - returns DOM element)
    // -- if (children.exist is true) and (children.visible is false), then
    // ---- call showChildren($node)
    for (var i=0; (i < $allDescendants.length && numHiddenDescendants > 0); i++) {
      childrenState = $('#orgchart_graphical').orgchart('getNodeState', $allDescendants.eq(i), 'children');
      if (childrenState.exist) {
        if (!childrenState.visible) {
          $('#orgchart_graphical').orgchart('showChildren', $allDescendants.eq(i));
          // recalculate number of hiddenDescendants
          numHiddenDescendants = $node.closest('tr').siblings().last().find('.slide-up').length;
        }
      } // end if childrenState exist
    } // end for

  }); // ==== end event handler for bottom edge

  return true;

} // end customCreateNode


/**
 * Call .orgchart library function to render graphical orgchart.
 * 
 * @param  {Object} dataSource    : json object for data used to build orgchart
 * @param  {int}  verticalDepth   : level at which display switches from horizontal to vertical
 * @return {boolean|true }
 */
function renderGraphicalOrgChart(datasource, verticalDepth) {

  // call graphical org chart library function to render graphical org chart
  $('#orgchart_graphical').orgchart({
    'data' : datasource,
    'depth': 15,                              // initial level that orgchart is expanded to                    
    'nodeTitle': 'title',                     // sets name property of datasource as text content of title section of orgchart node
    'nodeContent': 'name',                    // sets title property of datasource as text content of content section of orgchart node
    'verticalDepth': verticalDepth,           // align child nodes vertically from given depth 
    'createNode': function($node, data) {     // customize structure of node for secondMenu option - contact info
      customCreateNode($node, data);
    }   // end createNode

  });  // end function call for .orgchart

  if ($('#org-initialcontact').data('initialcontact') === 'show') {
    $('#orgchart_graphical .orgchart .node .second-menu-icon').each(function() {
        $(this).triggerHandler('click');
      });
  }

  // Remove  event handler for topEdge click 
  $('.topEdge').off(); 

  return true;
}

/**
 * Use html2canvas js library to export high resolution screenshot of orgchart. 
 * 
 * @param  {Object} srcEl      : DOM element that is used for canvas
 * @param  {int} scaleFactor   : scale provided to canvas for high resolution screenshot
 * @return {boolean|true}      
 */
function takeHighResScreenshot(srcEl, scaleFactor) {

  // Browser detection
  var isWebkit = 'WebkitAppearance' in document.documentElement.style;
  var isFf = !!window.sidebar;

  // Internet Explorer 6-11
  var isIE = (/*@cc_on!@*/false) || (!!document.documentMode);

  // Edge 20+
  var isEdge = (!(document.documentMode) && window.StyleMedia);

  var isIEOrEdge = isIE || isEdge;

  var $srcEl = $(srcEl);

  if (isIEOrEdge) {
    $srcEl.find('.second-menu-icon').hide();
  }
  
  // Save original size of element excluding margin
  var originalWidthWithoutMargin = srcEl.offsetWidth;   
  var originalHeightWithoutMargin = srcEl.offsetHeight;

  // Calculate original size of element including margin
  // Margin is set in CSS, and computed in Chrome and Safari, but not computed in Firefox. 
  var wasVisible = $srcEl.css('display') !== 'none';
  try {
    var $srcElHide = $srcEl.hide();
    var srcElMarginLeft = parseInt($srcElHide.css('margin-left'));
    var srcElMarginRight = parseInt($srcElHide.css('margin-right'));
    var srcElMarginTop = parseInt($srcElHide.css('margin-top'));
    var srcElMarginBottom = parseInt($srcElHide.css('margin-bottom'));
  } finally {
    if (wasVisible) $srcEl.show();
  }
  
  var originalWidthWithMargin = srcEl.offsetWidth + srcElMarginLeft + srcElMarginRight; 
  var originalHeightWithMargin = srcEl.offsetHeight + srcElMarginTop + srcElMarginBottom;

  // Force px size (no %, EMs, etc)
  srcEl.style.width = originalWidthWithMargin + "px";
  srcEl.style.height = originalHeightWithMargin + "px";

  // Position the element at the top left of the document because of bugs in html2canvas. The bug exists when supplying a custom canvas, and offsets the rendering on the custom canvas based on the offset of the source element on the page; thus the source element MUST be at 0, 0.
  // See html2canvas issues #790, #820, #893, #922
  srcEl.style.position = "fixed";
  srcEl.style.top = "0px";
  srcEl.style.left = "0px";

  // Create scaled canvas
  var scaledCanvas = document.createElement("canvas");

  scaledCanvas.width = originalWidthWithMargin * scaleFactor;
  scaledCanvas.height = originalHeightWithMargin * scaleFactor;
  scaledCanvas.style.width = originalWidthWithMargin + "px";
  scaledCanvas.style.height = originalHeightWithMargin + "px";

  var scaledContext = scaledCanvas.getContext("2d");
  scaledContext.scale(scaleFactor, scaleFactor);
  
  html2canvas(srcEl, { 
      canvas: scaledCanvas  
    })
      .then(function(canvas) {
        $('#orgchart_graphical').find('.mask').addClass('hidden');
        
        if ((!isWebkit && !isFf) || isIEOrEdge) {
          window.navigator.msSaveBlob(canvas.msToBlob(), 'OrgChart.png');
        }
        else {
          // canvas.toBlob() polyfill
          if (!HTMLCanvasElement.prototype.toBlob) {
            Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
              value: function (callback, type, quality) {

                var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
                    len = binStr.length,
                    arr = new Uint8Array(len);

                for (var i = 0; i < len; i++) {
                  arr[i] = binStr.charCodeAt(i);
                }

                callback( new Blob( [arr], {type: type || 'image/png'} ) );
              }
            });
          }

          canvas.toBlob(function(blob) {
            $('#org_img').attr('href', URL.createObjectURL(blob))[0].click();
          });
          // $('#org_img').attr('href', canvas.toDataURL())[0].click();
        }
        $('canvas').remove();   // Might need to set canvas id
      });
    
  //reset 
  srcEl.style.position = "inherit";
  srcEl.style.width = "auto"; 
  srcEl.style.height = "auto"; 
  if (isIEOrEdge) {
    $srcEl.find('.second-menu-icon').show();
  }   
} 

/**
 * Scrolls to the given target vertically and horizontally.
 * 
 * @param  {string} el.     DOM element for the target that needs to be centered
 * @param  {Object} parent  DOM element which needs to scroll (default .orgchart)
 * @return {void}
 */
function smoothlyScrollIntoView(el, parent) {
  parent = parent || '.orgchart';
  var $el = $(el);
  var $parent = $(parent);

  var elOffsetTop = $el.offset().top;
  var elHeight = $el.height();
  var tableOffsetTop = $('.orgchart > table').offset().top;
  var parentHeight = $parent.height();

  var scrollTopValue = elOffsetTop + elHeight/2 - tableOffsetTop - parentHeight/2;
   
  var elOffsetLeft = $el.offset().left;
  var elWidth = $el.width();
  var tableOffsetLeft = $('.orgchart > table').offset().left;
  var parentWidth = $parent.width();

  var scrollLeftValue = elOffsetLeft + elWidth/2 - tableOffsetLeft - parentWidth/2;

  $parent.scrollTop(scrollTopValue);
  $parent.scrollLeft(scrollLeftValue);
}

/**
 * Changes Custom Panel settings and triggers change to select drop down 
 * to show sub-chart.   
 * 
 * @return {void}
 */
function updateCustomOrgChart($selectedNode) {
  if ($selectedNode.length) {
    if (!$('#customize-btn').hasClass('active')) {
      $('#customize-btn').click();
    }
    $selectedNode.prop('selected', true);
    $('#select-root-node').trigger('change');
    $('#select-vert-depth').val(5).trigger('change');
  }
} 

/**
 * Checks for query string match with data-slug in select node drop-down list.   
 * If match found, shows sub-chart with root node focused. 
 * 
 * @return {void}
 */
function handleDeepLink() {
  var show_top_as = getParameterByName('node');
  if (show_top_as) {  // url has query string
    var $selectedNode = $('#select-root-node option').filter('[data-slug="' + show_top_as + '"]');
    if ($selectedNode.length) { // is parent node
      updateCustomOrgChart($selectedNode);
      $('.orgchart').find('.node:first').addClass('focused');
    }
  }
  else { // check if url has hash
    var hashValue = location.hash.substring(1);
    if (!hashValue == '') {
      var $hashNode = $('.orgchart').find('.node').filter( function() {
        return $(this).data('slug') === hashValue; 
      });
      if ($hashNode.length) {
        var hashNodeId = $hashNode[0].id;
        $('#'+hashNodeId).find('.title').addClass('highlighted');
        $('#'+hashNodeId).find('.content').addClass('highlighted');
        $('#'+hashNodeId).find('.symbol').addClass('highlighted');

        // scroll to node and center it within .orgchart
        smoothlyScrollIntoView('#'+hashNodeId);
      }
    }
  }
}

/**
 * Redraws responsive org chart based on vertical depth.   
 * 
 * @return {void}
 */
function redrawOrgChart(datasource, verticalDepth, visibleRootNodeId) {
  var $visibleNodes = $('.orgchart').find('.node:visible');
  var visibleRootNodeId = visibleRootNodeId || $visibleNodes[0].id;
  var $chartContainerEdit = $('#orgchart_graphical');
  
  $chartContainerEdit.empty();

  if (!$chartContainerEdit.children().length) {
    var visibleDatasource = findOrgDataObjectById(visibleRootNodeId, datasource);

    renderGraphicalOrgChart(visibleDatasource, verticalDepth);
    setGraphicalOrgChartBackground();
    visibleRootNodeId = $('#select-root-node').val();
    if ($('#contact-btn').hasClass('active')) {
      $('#orgchart_graphical .orgchart .node .second-menu-icon').trigger('click');
    }
  }
}

/**
 * Determines vertical depth based on media query, redraws org chart based on
 * calculated vertical depth, and adjusts slider value.   
 * 
 * @return {int} calculatedVerticalDepth
 */
function determineVerticalDepth(window_size) {
  var calculatedVerticalDepth = -1;
  var verticalDepthAdjustments = {
    'small': -2,
    'medium': -1,
    'large': 0,
    'xl': 1,
  };

  calculatedVerticalDepth = $('#select-vert-depth').data('initial-depth') + verticalDepthAdjustments[window_size];

  return Math.min(Math.max(calculatedVerticalDepth, 2), 8);
}

/**
 * Determines current window size based on pre-defined breakpoints.
 * 
 * @return {string}
 */
function currentWindowSize() {
  for (var window_size in mediaBreakpoints) {
    if (mediaBreakpoints.hasOwnProperty(window_size) && 
        window.matchMedia(mediaBreakpoints[window_size]).matches) {
      return window_size;
    }
  }

  return 'xl';
}

/**
 * Formats data for graphical org chart and saves it in datasource - datasource is used in  
 * jquery.orgchart library.
 * Steps:
 *   - Get data from org_data[0] and save it in org_data_graphical. org_data is an array and datasource is an object.
 *   - Use JSON.stringify on org_data_graphical object to get string with JSON text. Use filter for id, name, title, nodes, text
 *   - to extract these fields only. 
 *   - Replace all occurences of '"nodes":' including white space(s) after : with '"children":'
 *   - Use JSON.parse to convert string with JSON text (org_data_graphical) to JavaScript object (datasource)
 *   - Follow jquery.orgchart.js library instructions to register and render graphical orgchart
 * 
 * @return {JSON object}
 */
function getPreparedOrgData(data) {
  var whitelisted_fields = [
    'id',
    'name',
    'title',
    'phone',
    'location',
    'email',
    'adjacent',
    'nodes',
    'level',
    'slug',
    'headshot',
    'placeholderimg',
  ];

  // filter data from org_data to extract id, name, title, nodes, and text fields.
  // 3rd parameter in JSON.stringify is set to 4 for now for console pretty-print, can be updated later if needed.
  return JSON.parse(
    JSON.stringify(data, whitelisted_fields, 4)
      .replace(/"nodes"\s*:/g, '"children":')
      .replace(/"children": null/g, '"children": []')
  );
}

/**
 * Toggles full screen mode for graphical org chart.
 *
 * @param {HTMLElement} element - The HTML element for which to toggle full screen mode.
 * @return void
 */
var toggleFullScreen = function(element) {
  var isInFullScreenMode = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);
  var $mask = $(element).find('.mask');
  
  if (!$mask.length) {
    $mask = $('<div class="mask"><i class="fa fa-circle-o-notch fa-spin spinner"></i></div>').appendTo(element);
  }

  $mask.css('display', 'inherit');

  if (isInFullScreenMode) {
    $(element).find('.fullscreen-element').removeClass('fa-compress').addClass('fa-expand');
    doFullScreenAction(document, document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen);
  } else {
    $(element).find('.fullscreen-element').removeClass('fa-expand').addClass('fa-compress');
    doFullScreenAction(element, element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen);
  }

  $mask.css('display', 'none');
}

/**
 * Execute a full screen action on the org chart
 * 
 * @param {HTMLElement} element - The element to which to apply the full screen action
 * @param {function} fullScreenAction - The full screen action to execute
 * @return void
 */
var doFullScreenAction = function(element, fullScreenAction) {
  if (typeof fullScreenAction === 'function') {
    fullScreenAction.call(element);
  }
}

/**
 * Sets the graphical org chart background color.
 *
 * @return {jQuery}
 */
var setGraphicalOrgChartBackground = function() {
  return $('#orgchart_graphical .orgchart, #orgchart_graphical .orgchart > table > tbody').css({
    'background-color': $('#select-bg-color').val(),
  });
};


/**
 * Resets configurable parameters for graphical org chart.
 *
 * @return {jQuery}
 */
function resetGraphicalOrgChartConfigParameters(calculatedVerticalDepth) {
  $('#select-bg-color').val("rgba(0,0,0,0)");         // transparent
  $('#select-vert-depth').val(calculatedVerticalDepth); 
  $('#select-root-node option:first-of-type').attr("selected", "selected");
  $('#contact-btn').removeClass('active');
}

/**
 * Shows graphical Org Chart and registers handlers for configurable parameters.
 *  
 * @return {void}
 */
function showGraphicalOrgChart(datasource, defaultVerticalDepth) {
  var defaultVerticalDepth = defaultVerticalDepth || parseInt($('#select-vert-depth').val());

  // call graphical org chart library function to render graphical org chart
  renderGraphicalOrgChart(datasource, defaultVerticalDepth);

  // Configurable options panel for graphical orgchart
  $('#customize-btn').on('click', function() {
    $(this).toggleClass('active');
    $('#custom-panel').toggleClass('show');
  });

  // Configurable option for graphical orchart background 
  $('#select-bg-color').change(setGraphicalOrgChartBackground);

  // Configurable option for graphical orchart vertical depth
  $('#select-vert-depth').change(function () {
      redrawOrgChart(datasource, parseInt($(this).val()));
    }); // end configurable option for orgchart vertical depth

    // Configurable option for graphical orchart select top node 
    var options = '';

    // Build drop-down list for selecting top node
    $.each($('.node'), function(i, val){

      var $val = $(val);

      var hasChildren = true;

      var $target = $val.closest('tr');

      if (!$target.siblings().length) {  // no children - skip to next iteration 
        return true;
      }

      var level = $val.data('level');

      if ($target.is('.verticalNodes')) {
          if ($val.siblings().last().is('ul')) {
            hasChildren = true;
          }
          else { // no children - skip to next iteration
            return true;
          }
      } // end verticalNodes

      if (hasChildren) {
        options += '<option value="' + val.id + '" data-level="' + level + '" data-slug="'+ $val.data('slug') +'"">';
        
        for (var i=1; i < level; i++) {
          options += '--';
        }
        
        options += $(val).children('.title').text();
      
        displayText = $val.children('.content').clone().children().remove().end().text();

        if (displayText.length) {
          options += ' - ' + displayText;
        }
        options += '</option>';
      } // end hasChildren
      
    }); // end build drop-down list to select top node

    $('#select-root-node').append(options);

    // redraw orgchart with selected node as root node
    $('#select-root-node').on('change', function (e) {
      var rootNodeId = $(this).val();
      var rootNodeDatasource = findOrgDataObjectById(rootNodeId, datasource);
      var normalizedVerticalDepth = normalizeVerticalDepth(rootNodeDatasource.level);

      redrawOrgChart(datasource, normalizedVerticalDepth, rootNodeId);
    });

    // event handler for orgchart Export
    $('#export-btn').on('click', function(e){
      e.preventDefault();

      if ($(this).children('.spinner').length) {
        return false;
      }
      var $exportChartContainer = $('#orgchart_graphical');

      var $mask = $exportChartContainer.find('.mask');
      if (!$mask.length) {
        $exportChartContainer.append('<div class="mask"><i class="fa fa-circle-o-notch fa-spin spinner"></i></div>');
      } else {
        $mask.removeClass('hidden');
      }

      var source = document.querySelector('#orgchart_graphical div.orgchart tbody');

      var mediaQuery = window.matchMedia("(max-device-width: 1024px)");
      if (mediaQuery.matches) {
        takeHighResScreenshot(source, 1);     // low resolution for smartphones, tablets
      } else {
        takeHighResScreenshot(source, 2);     // high resolution for desktops, laptops
      }

    }); // end event handler for orgchart Export
  
  // event handler for reset btn - show default org chart
  $('#custom-panel-btn-reset').on('click', function(e) {

    var $chartContainerReset = $('#orgchart_graphical');
           
    $chartContainerReset.empty();                   // remove content of #orgchart_graphical

    if (!$chartContainerReset.children().length) {  // if original chart has been deleted

      var calculatedVerticalDepth = determineVerticalDepth(currentWindowSize());
      
      //re-draw default orgchart
      renderGraphicalOrgChart(datasource, calculatedVerticalDepth);

      // reset configurable parameters to default values
      resetGraphicalOrgChartConfigParameters(calculatedVerticalDepth);      
    } // end check for original chart deleted
  });   // end #custom-panel-btn-reset event handler

  // contact handler
  $('#contact-btn').on('click', function(e) {
    $(this).toggleClass('active');
    $('#orgchart_graphical .orgchart .node .second-menu-icon').each(function() {
      $(this).triggerHandler('click');
    });
  });

  // fullscreen handler
  $('#orgchart-graphical-container .fullscreen-element').on('click', function(e){
    toggleFullScreen(document.getElementById('orgchart-graphical-container'));
  });

  // hide Export button on IE and Edge
  // Internet Explorer 6-11
  var isIE = (/*@cc_on!@*/false) || (!!document.documentMode);

  // Edge 20+
  var isEdge = (!(document.documentMode) && window.StyleMedia);

  if (isIE || isEdge) {
    $('#export-btn').hide();
  }

} // end function showGraphicalOrgChart

function redrawGraphicalOrgChartOnResize(datasource, breakpoints) {
  Object.keys(breakpoints).forEach(function(window_size, index) {
    window.matchMedia(breakpoints[window_size]).addListener(function(query) {
      if (query.matches) {
        var newVerticalDepth = determineVerticalDepth(window_size);
        redrawOrgChart(datasource, newVerticalDepth);
        $('#select-vert-depth').val(newVerticalDepth);      }
    });
  });
}

/**
 * Scrolls to the top of the page.
 * 
 * @return {void}
 */
function scrollToTop() {
  smoothlyScrollTo('body');
}

/**
 * Scrolls to the given target within the given amount of time.
 * 
 * @param  {string} target_selector jQuery selector for the target
 * @param  {int} duration        time in milliseconds for the animation (default 500)
 * @return {void}
 */
function smoothlyScrollTo(target_selector, duration) {
  $('html, body').animate({
    scrollTop: $(target_selector).offset().top
  }, duration || 500);
}

jQuery(document).ready(function($) {

  // Register and render the org chart
  if (typeof $.fn.treeview === 'function' && document.body.contains(document.getElementById('orgchart')) && typeof org_data === 'object') {
    $('#orgchart').treeview({
      data: org_data,
      showBorder: true,
      expandIcon: "fa fa-chevron-right",
      collapseIcon: "fa fa-chevron-down",
      emptyIcon: "fa",
      // showTags: true,
      levels: Number($('#orgchart').data('expanded')) || 10,
      onhoverColor: "rgba(183, 177, 169, 0.3)",
      selectedBackColor: "#008542",
      searchResultColor: "#008542",
      searchResultBackColor: "rgba(183, 177, 169, 0.15)",
      selectedIcon: "white",
      selectedColor: "white",
      highlightSelected: false,
      enableLinks: true,
    });
  }

  // Register the org chart search triggers
  $('#orgchart_search_btn').click(searchOrgChart);
  $('#orgchart_search_clr').click(clearSearchOrgChart);
  $('#orgchart_search_box').keyup(function(event) {
    if (this.value.length > 2) {
      searchOrgChart();
    } else {
      $('#orgchart_search_results').html('');
      $('#orgchart').treeview('clearSearch');
    }
  });

  
  // Check if graphical orgchart library exists before invoking showGraphicalOrgChart function,   
  // which registers and renders the graphical orgchart.
  if (typeof $.fn.orgchart === 'function' && document.body.contains(document.getElementById('orgchart_graphical')) && typeof org_data === 'object') {

    var datasource = getPreparedOrgData(org_data[0]);
    // Mobile adjustment for vertical depth for initial page load
    var $verticalDepthSlider = $('#select-vert-depth');
    var initialDepth = parseInt($verticalDepthSlider.val());

    $verticalDepthSlider.data('initial-depth', initialDepth);

    var calculatedVerticalDepth = determineVerticalDepth(currentWindowSize());
    $verticalDepthSlider.val(calculatedVerticalDepth);

    showGraphicalOrgChart(datasource, calculatedVerticalDepth);
    redrawGraphicalOrgChartOnResize(datasource, mediaBreakpoints);
  }

  // Register the org chart tag searches
  registerOrgChartTagSearch();
  $('#orgchart').on('searchComplete searchCleared', function(e) {
    setTimeout(registerOrgChartTagSearch, 500);
  });

  // Register the scroll-to-top button
  $(document).on( 'scroll', function(){
    if ($(window).scrollTop() > 100) {
      $('.scroll-top-wrapper').addClass('show');
    } else {
      $('.scroll-top-wrapper').removeClass('show');
    }
  });
  $('.scroll-top-wrapper').on('click', scrollToTop);

  // Load any orgchart query-string searches on page load
  (function() {
    var search_orgchart_for = getParameterByName('orgchart_search');
    if (search_orgchart_for) {
      $('#orgchart_search_box').val(search_orgchart_for);
      searchOrgChart();
      if (history.replaceState) { // clear out the query from the URL
        history.replaceState(null, null, location.href.replace(/[?&]orgchart_search=[^&]+/, ''));
      }
    }
  })();

  $(window).on('load', function() {
    // scroll to element after page has fully loaded
    if (typeof $.fn.orgchart === 'function') {
      handleDeepLink();
    } 
  });

});
