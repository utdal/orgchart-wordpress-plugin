/** Research Organizational Chart
 *
 *  requires: jQuery, Bootstrap Treeview, org_data = []
 */

var $ = jQuery.noConflict();

var orgChartPlugin = (function(window, $, undefined) {

  /**
   * Variable for media breakpoints - phone, tablet, desktop, big screen
  */
  const mediaBreakpoints = {
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
    let match = RegExp('[?&]' + n + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }

  /**
   * Search the org chart.
   * 
   * @return {void}
   */
  function searchOrgChart() {
    let searchfor = $('#orgchart_search_box').val();
    const options = {
      ignoreCase: true,
      exactMatch: false,
      revealResults: true,
    };

    let results = $('#orgchart').treeview('search', [searchfor, options]);

    let output = '<ul><p>' + results.length + ' matches found</p>';
    $.each(results, function (index, result) {
      output += '<li>';
      output += '<p><a href="#' + result.slug + '" class="hide-default-icon">' + result.name + '</a>' + (result.title ? (' - <em>' + result.title + '</em>') : '') + '<br>';
      let person_info = [];
      if (result.phone) {
        person_info.push('<a href="tel:' + result.phone + '" class="no-desktop-link">' + result.phone + '</a>');
      }
      if (result.location) {
        if (result.location_url) {
          person_info.push('<a href="' + result.location_url + '" class="hide-default-icon" target="_blank"><i class="fa fa-map-marker"></i> ' + result.location + '</a>');
        } else {
          person_info.push('<i class="fa fa-map-marker"></i> ' + result.location);
        }
      }
      if (result.email) {
        person_info.push('<a href="mailto:' + result.email + '">' + result.email + '</a>');
      }
      output += person_info.join(' &#124; ') + '</p>';
      output += '</li>';
    });
    output += '</ul>';
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
    let $verticalDepthSlider = $('#select-vert-depth');
    let should_be_value = $verticalDepthSlider.data('should-be-value');
    let oldLevel = $('#orgchart_graphical').find('.node:first').data('level');
    let relativeLevel = newLevel - oldLevel;
    let current_depth_slider_value = (should_be_value === undefined) ? $verticalDepthSlider.val() : should_be_value;

    let selectedVerticalDepth = current_depth_slider_value - relativeLevel;

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
      for (let i = 0; i < odata.children.length; i++) {
        let child_val = findOrgDataObjectById(id, odata.children[i]);
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

    if (data.is_organization && data.hasOwnProperty('name')) {
      $node.addClass('group');
      $node.find('.title').html('<i class="fa fa-building symbol"></i>' + data.name);
      $node.find('.content').html('');
    }

    // Add contact info 
    let contact_info = "<div class='orgchartg-contact-info'>";

    if (avatardata.show_avatar && !data.hide_headshot) {
      if (data.headshot) {
        contact_info += data.headshotimg;
      } else {
        contact_info += data.placeholderimg;
      }
    }

    if (data.phone) {
      contact_info += data.phone + "<br>";
    }

    if (data.location) {
      if (data.location_url) {
        contact_info += "<a href='" + data.location_url + "' target='_blank'>" + data.location + "</a>";
      } else {
        contact_info += data.location;
      }
    }

    if (data.location && data.email) {
      contact_info += " | ";
    }

    if (data.email) {
      contact_info += "<a href='mailto:" + data.email + "'>" + "<i class='fa fa-envelope-o symbol'></i>" + "</a>";
    }

    contact_info += "</div>";

    // if the node has either email or phone, then add secondMenu to show contact info on click
    if ( (data.phone) || (data.email) ) {
      $node.find('.content').append(contact_info);

      let secondMenuIcon = $('<i>', {
        'class': 'fa fa-info-circle second-menu-icon',
        on: {
          click: function() {    
            setGraphicalOrgChartNodeContact($(this).closest('.node'));
          },
        },
      });

      $node.append(secondMenuIcon);
    }

    // check for admin node
    if (data.hasOwnProperty('adjacent')) {
      if (data.adjacent) {
        $node.addClass('admin');
        $node.find('.title').html('<i class="fa fa-id-badge symbol"></i>' + data.title);
      }
    }

    // bind event handler for bottom edge click
    $node.on('click', '.bottomEdge', function(event) {
      event.stopPropagation();
      let $orgchartContainer = $('#orgchart_graphical');
      let $that = $(this);
      let $node = $that.parent();

      // check if children exist and/or are visible
      let childrenState = $orgchartContainer.orgchart('getNodeState', $node, 'children');

      if (!childrenState.exist) {
        return;
      }

      let $allDescendants = $node.closest('tr').siblings().last().find('.node');
      let $hiddenDescendants = $node.closest('tr').siblings().last().find('.slide-up');

      if (!$hiddenDescendants.length) {  // all descendants visible
        return;
      }

      //keep track of number made visible so no unnecessarily looping over remainder nodes
      let numHiddenDescendants = $hiddenDescendants.length;   

      //loop through allDescendants list 
      // - call getNodeState($node,'children') on each object from allDescendants list
      // - use .eq - returns jQuery object, (don't use .get - returns DOM element)
      // -- if (children.exist is true) and (children.visible is false), then
      // ---- call showChildren($node)
      for (let i=0; (i < $allDescendants.length && numHiddenDescendants > 0); i++) {
        childrenState = $orgchartContainer.orgchart('getNodeState', $allDescendants.eq(i), 'children');
        if (childrenState.exist) {
          if (!childrenState.visible) {
            $orgchartContainer.orgchart('showChildren', $allDescendants.eq(i));
            // recalculate number of hiddenDescendants
            numHiddenDescendants = $node.closest('tr').siblings().last().find('.slide-up').length;
          }
        }
      }

    });

    return true;
  }


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
      }
    });

    if ($('#org-initialcontact').data('initialcontact') === 'show' && ($('#contact-btn').length === 0 || $('#contact-btn').hasClass('active'))) {
      setGraphicalOrgChartContact(true);
    }

    // Remove  event handler for topEdge click 
    $('.topEdge').off(); 

    return true;
  }

  /**
   * Export a screenshot of the orgchart. 
   * 
   * @param  {Object} srcEl      : DOM element that is used for canvas
   * @param  {int} scaleFactor   : scale provided to canvas for high resolution screenshot
   * @return {void}      
   */
  function takeScreenshot(srcEl, scaleFactor) {

    // Browser detection
    const isWebkit = 'WebkitAppearance' in document.documentElement.style;
    const isFf = !!window.sidebar;

    // Internet Explorer 6-11
    const isIE = (/*@cc_on!@*/false) || (!!document.documentMode);

    // Edge 20+
    const isEdge = (!(document.documentMode) && window.StyleMedia);

    const isIEOrEdge = isIE || isEdge;

    let $srcEl = $(srcEl);

    if (isIEOrEdge) {
      $srcEl.find('.second-menu-icon').hide();
    }

    // Calculate original size of element including margin
    // Margin is set in CSS, and computed in Chrome and Safari, but not computed in Firefox. 
    let wasVisible = $srcEl.css('display') !== 'none';
    try {
      var $srcElHide = $srcEl.hide();
      var srcElMarginLeft = parseInt($srcElHide.css('margin-left'));
      var srcElMarginRight = parseInt($srcElHide.css('margin-right'));
      var srcElMarginTop = parseInt($srcElHide.css('margin-top'));
      var srcElMarginBottom = parseInt($srcElHide.css('margin-bottom'));
    } finally {
      if (wasVisible) $srcEl.show();
    }

    let originalWidthWithMargin = srcEl.offsetWidth + srcElMarginLeft + srcElMarginRight; 
    let originalHeightWithMargin = srcEl.offsetHeight + srcElMarginTop + srcElMarginBottom;

    // Force px size (no %, EMs, etc)
    srcEl.style.width = originalWidthWithMargin + "px";
    srcEl.style.height = originalHeightWithMargin + "px";

    // Position the element at the top left of the document because of bugs in html2canvas. The bug exists when supplying a custom canvas, and offsets the rendering on the custom canvas based on the offset of the source element on the page; thus the source element MUST be at 0, 0.
    // See html2canvas issues #790, #820, #893, #922
    srcEl.style.position = "fixed";
    srcEl.style.top = "0px";
    srcEl.style.left = "0px";

    // Create scaled canvas
    let scaledCanvas = document.createElement("canvas");

    scaledCanvas.width = originalWidthWithMargin * scaleFactor;
    scaledCanvas.height = originalHeightWithMargin * scaleFactor;
    scaledCanvas.style.width = originalWidthWithMargin + "px";
    scaledCanvas.style.height = originalHeightWithMargin + "px";

    let scaledContext = scaledCanvas.getContext("2d");
    scaledContext.scale(scaleFactor, scaleFactor);

    html2canvas(srcEl, { 
        canvas: scaledCanvas  
      })
        .then(function(canvas) {
          $('#orgchart_graphical').find('.mask').addClass('hidden');

          if ((!isWebkit && !isFf) || isIEOrEdge) {
            window.navigator.msSaveBlob(canvas.msToBlob(), 'OrgChart.png');
          } else {
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
          }
          $('canvas').remove();   // Might need to set canvas id
        });

    // reset 
    srcEl.style.position = "inherit";
    srcEl.style.width = "auto"; 
    srcEl.style.height = "auto"; 
    if (isIEOrEdge) {
      $srcEl.find('.second-menu-icon').show();
    }
  }

  /**
   * Export a high resolution screenshot of the orgchart.
   *
   * @param  {Object} srcEl      : DOM element that is used for canvas
   * @return {void}
   */
  function takeHighResScreenshot(srcEl) {
    takeScreenshot(srcEl, 2);
  }

  /**
   * Export a high resolution screenshot of the orgchart.
   *
   * @param  {Object} srcEl      : DOM element that is used for canvas
   * @return {void}
   */
  function takeLowResScreenshot(srcEl) {
    takeScreenshot(srcEl, 1);
  }

  /**
   * Scrolls to the given target vertically and horizontally.
   * 
   * @param  {jQuery} $el     jQuery element for the target that needs to be centered
   * @param  {Object} parent  DOM element which needs to scroll (default .orgchart)
   * @return {void}
   */
  function scrollIntoView($el, parent) {
    let $parent = $(parent || '.orgchart');
    let $table = $('.orgchart > table');

    $parent.scrollTop($el.offset().top + $el.height() / 2 - $table.offset().top - $parent.height() / 2);
    $parent.scrollLeft($el.offset().left + $el.width() / 2 - $table.offset().left - $parent.width() / 2);
  }

  /**
   * Changes Custom Panel settings and triggers change to select drop down 
   * to show sub-chart.   
   * 
   * @param {string} slug The slug id of the top node to select
   * @return {void}
   */
  function selectOrgChartRootNode(slug) {
    let $selectedNode = $('#select-root-node option').filter('[data-slug="' + slug + '"]');

    if ($selectedNode.length) {
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
    let top_node_slug = getParameterByName('node');
    let highlighted_node_slug = top_node_slug || location.hash.substring(1);

    if (top_node_slug) {
      selectOrgChartRootNode(top_node_slug);
    }

    if (highlighted_node_slug) {
      highlightOrgChartNode(highlighted_node_slug);
    }
  }

  /**
   * Highlights and centers a node.
   * 
   * @param {string} slug The slug id of the node to highlight
   * @return {void}
   */
  function highlightOrgChartNode(slug) {
    let $node = $('.orgchart').find('.node').filter(function () {
      return $(this).data('slug') === slug;
    });

    if ($node.length) {
      $node.find('.title,.content,.symbol').addClass('highlighted');
      setTimeout(function() {
        scrollIntoView($node);
      }, 210); // wait for scrolldown/up in order to calc correct height
    }
  }

  /**
   * Redraws responsive org chart based on vertical depth.   
   * 
   * @return {void}
   */
  function redrawOrgChart(datasource, verticalDepth, visibleRootNodeId) {
    let $chartContainerEdit = $('#orgchart_graphical');
    let $visibleNodes = $('.orgchart').find('.node:visible');
    visibleRootNodeId = visibleRootNodeId || $visibleNodes[0].id;

    $chartContainerEdit.empty();

    if (!$chartContainerEdit.children().length) {
      let visibleDatasource = findOrgDataObjectById(visibleRootNodeId, datasource);

      renderGraphicalOrgChart(visibleDatasource, verticalDepth);
      setGraphicalOrgChartBackground();
      setGraphicalOrgChartContact();
    }
  }

  /**
   * Determines vertical depth based on media query, redraws org chart based on
   * calculated vertical depth, and adjusts slider value.   
   * 
   * @param {string} window_size (small, medium, large, or xl)
   * @return {int} calculatedVerticalDepth
   */
  function determineVerticalDepth(window_size) {
    let calculatedVerticalDepth = -1;
    const verticalDepthAdjustments = {
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
    const whitelisted_fields = [
      'id',
      'name',
      'title',
      'phone',
      'location',
      'location_url',
      'email',
      'adjacent',
      'is_organization',
      'nodes',
      'level',
      'slug',
      'hide_headshot',
      'headshot',
      'headshotimg',
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
  function toggleFullScreen(element) {
    let isInFullScreenMode = (document.fullscreenElement && document.fullscreenElement !== null) ||
          (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
          (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
          (document.msFullscreenElement && document.msFullscreenElement !== null);
    let $element = $(element);
    let $mask = $element.find('.mask');

    if (!$mask.length) {
      $mask = $('<div class="mask"><i class="fa fa-circle-o-notch fa-spin spinner"></i></div>').appendTo(element);
    }

    $mask.css('display', 'inherit');

    if (isInFullScreenMode) {
      $element.find('.fullscreen-element').removeClass('fa-compress').addClass('fa-expand');
      doFullScreenAction(document, document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen);
    } else {
      $element.find('.fullscreen-element').removeClass('fa-expand').addClass('fa-compress');
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
  function doFullScreenAction(element, fullScreenAction) {
    if (typeof fullScreenAction === 'function') {
      fullScreenAction.call(element);
    }
  }

  /**
   * Sets the graphical org chart background color.
   *
   * @return {jQuery}
   */
  function setGraphicalOrgChartBackground() {
    return $('#orgchart_graphical .orgchart, #orgchart_graphical .orgchart > table > tbody').css({
      'background-color': $('#select-bg-color').val(),
    });
  };

  /**
   * Sets the graphical org chart contact visibility
   *
   * @param {boolean} show force show or hide all contact visibility (optional)
   */
  function setGraphicalOrgChartContact(show) {
    if (typeof show === 'undefined') {
      if ($('#contact-btn').length > 0) {
        show = $('#contact-btn').hasClass('active');
      } else {
        show = $('#org-initialcontact').data('initialcontact') === 'show';
      }
    }

    setGraphicalOrgChartNodeContact($('#orgchart_graphical .orgchart .node'), show);
  }

  /**
   * Sets the graphical org chart node contact visibility
   *
   * @param {jQuery} $node the node for which to set contact visibility
   * @param {boolean} show force show or hide contact visibility (optional. default: toggle visibility)
   */
  function setGraphicalOrgChartNodeContact($node, show) {
    let $contact_info = $node.find('.orgchartg-contact-info');
    let expanded = $contact_info.hasClass('expanded');
    if (typeof show === 'undefined') {
      show = !expanded;
    }

    if (show) {
      if (!expanded) {
        $contact_info.addClass('expanded').slideDown(200);
      }
    } else {
      if (expanded) {
        $contact_info.removeClass('expanded').slideUp(200);
      }
    }
  }

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
    defaultVerticalDepth = defaultVerticalDepth || parseInt($('#select-vert-depth').val());

    // call graphical org chart library function to render graphical org chart
    renderGraphicalOrgChart(datasource, defaultVerticalDepth);

    // Configurable options panel for graphical orgchart
    $('#customize-btn').on('click', function() {
      $('#panel-toggle').toggleClass('fa-caret-right');
      $('#panel-toggle').toggleClass('fa-caret-down');
      $(this).toggleClass('active');
      $('#custom-panel').toggleClass('show');
    });

    // Configurable option for graphical orchart background 
    $('#select-bg-color').on('change', setGraphicalOrgChartBackground);

    // Configurable option for graphical orchart vertical depth
    $('#select-vert-depth').on('change', function() {
      redrawOrgChart(datasource, parseInt($(this).val()));
    });

    // Configurable option for graphical orchart select top node 
    let options = '';
    $.each($('.node'), function(i, val) {
      let $val = $(val);
      let hasChildren = true;
      let $target = $val.closest('tr');
      let level = $val.data('level');

      if (!$target.siblings().length) {  // no children - skip to next iteration 
        return true;
      }

      if ($target.is('.verticalNodes')) {
        if ($val.siblings().last().is('ul')) {
          hasChildren = true;
        } else { // no children - skip to next iteration
          return true;
        }
      }

      if (hasChildren) {
        options += '<option value="' + val.id + '" data-level="' + level + '" data-slug="'+ $val.data('slug') +'"">';

        for (let i=1; i < level; i++) {
          options += '--';
        }

        options += $(val).children('.title').text();

        displayText = $val.children('.content').clone().children().remove().end().text();

        if (displayText.length) {
          options += ' - ' + displayText;
        }

        options += '</option>';
      }

    });
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

      let $exportChartContainer = $('#orgchart_graphical');
      let $mask = $exportChartContainer.find('.mask');

      if (!$mask.length) {
        $exportChartContainer.append('<div class="mask"><i class="fa fa-circle-o-notch fa-spin spinner"></i></div>');
      } else {
        $mask.removeClass('hidden');
      }

      let source = document.querySelector('#orgchart_graphical div.orgchart > table > tbody');
      if (!source) { // insert a tbody if needed
        source = document.querySelector('#orgchart_graphical > .orgchart > table').createTBody();
        document.querySelectorAll('#orgchart_graphical > .orgchart > table > tr').forEach((tr) => source.append(tr));
      }
      let mediaQuery = window.matchMedia("(max-device-width: 1024px)");
      if (mediaQuery.matches) {
        takeLowResScreenshot(source); // low resolution for smartphones, tablets
      } else {
        takeHighResScreenshot(source); // high resolution for desktops, laptops
      }
    });

    // event handler for reset btn - show default org chart
    $('#custom-panel-btn-reset').on('click', function(e) {
      let $chartContainerReset = $('#orgchart_graphical');

      $chartContainerReset.empty(); // remove content of #orgchart_graphical

      if (!$chartContainerReset.children().length) {  // if original chart has been deleted
        let calculatedVerticalDepth = determineVerticalDepth(currentWindowSize());

        renderGraphicalOrgChart(datasource, calculatedVerticalDepth);
        resetGraphicalOrgChartConfigParameters(calculatedVerticalDepth);      
      }
    });

    // contact handler
    $('#contact-btn').on('click', function(e) {
      $(this).toggleClass('active');
      setGraphicalOrgChartContact();
    });

    // fullscreen handler
    $('#orgchart-graphical-container .fullscreen-element').on('click', function(e){
      toggleFullScreen(document.getElementById('orgchart-graphical-container'));
    });

    // hide Export button on IE and Edge
    // Internet Explorer 6-11
    const isIE = (/*@cc_on!@*/false) || (!!document.documentMode);

    // Edge 20+
    const isEdge = (!(document.documentMode) && window.StyleMedia);

    if (isIE || isEdge) {
      $('#export-btn').hide();
    }

  }

  function redrawGraphicalOrgChartOnResize(datasource, breakpoints) {
    Object.keys(breakpoints).forEach(function(window_size, index) {
      window.matchMedia(breakpoints[window_size]).addListener(function(query) {
        if (query.matches) {
          let newVerticalDepth = determineVerticalDepth(window_size);
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

  // public methods & properties
  return {
    'mediaBreakpoints': mediaBreakpoints,
    'searchOrgChart': searchOrgChart,
    'clearSearchOrgChart': clearSearchOrgChart,
    'getPreparedOrgData': getPreparedOrgData,
    'showGraphicalOrgChart': showGraphicalOrgChart,
    'determineVerticalDepth': determineVerticalDepth,
    'redrawGraphicalOrgChartOnResize': redrawGraphicalOrgChartOnResize,
    'registerOrgChartTagSearch': registerOrgChartTagSearch,
    'scrollToTop': scrollToTop,
    'getParameterByName': getParameterByName,
    'currentWindowSize': currentWindowSize,
    'handleDeepLink': handleDeepLink,
  };

})(window, $);

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

  // modified from cowboy/jquery-throttle-debounce
  let debounce = {};
  (function (b, c) { var a; $.throttle = a = function (e, f, j, i) { var h, d = 0; if (typeof f !== "boolean") { i = j; j = f; f = c } function g() { var o = this, m = +new Date() - d, n = arguments; function l() { d = +new Date(); j.apply(o, n) } function k() { h = c } if (i && !h) { l() } h && clearTimeout(h); if (i === c && m > e) { l() } else { if (f !== true) { h = setTimeout(i ? k : l, i === c ? e - m : e) } } } if ($.guid) { g.guid = j.guid = j.guid || $.guid++ } return g }; b.do = function (d, e, f) { return f === c ? a(d, e, false) : a(d, f, e !== false) } })(debounce);

  // Register the org chart search triggers
  $('#orgchart_search_btn').on('click', orgChartPlugin.searchOrgChart);
  $('#orgchart_search_clr').on('click', orgChartPlugin.clearSearchOrgChart);
  $('#orgchart_search_box').on('keyup', debounce.do(150, function(event) {
    if (this.value.length > 2) {
      orgChartPlugin.searchOrgChart();
    } else {
      $('#orgchart_search_results').html('');
      $('#orgchart').treeview('clearSearch');
    }
  }));

  // Check if graphical orgchart library exists before invoking showGraphicalOrgChart function,   
  // which registers and renders the graphical orgchart.
  if (typeof $.fn.orgchart === 'function' && document.body.contains(document.getElementById('orgchart_graphical')) && typeof org_data === 'object') {
    let datasource = orgChartPlugin.getPreparedOrgData(org_data[0]);
  
    // Mobile adjustment for vertical depth for initial page load
    let $verticalDepthSlider = $('#select-vert-depth');
    $verticalDepthSlider.data('initial-depth', parseInt($verticalDepthSlider.val()));

    let calculatedVerticalDepth = orgChartPlugin.determineVerticalDepth(orgChartPlugin.currentWindowSize());
    $verticalDepthSlider.val(calculatedVerticalDepth);

    orgChartPlugin.showGraphicalOrgChart(datasource, calculatedVerticalDepth);
    orgChartPlugin.redrawGraphicalOrgChartOnResize(datasource, orgChartPlugin.mediaBreakpoints);
    orgChartPlugin.handleDeepLink();
  }

  // Register the org chart tag searches
  orgChartPlugin.registerOrgChartTagSearch();
  $('#orgchart').on('searchComplete searchCleared', function(e) {
    setTimeout(orgChartPlugin.registerOrgChartTagSearch, 500);
  });

  // Register the scroll-to-top button
  $(document).on( 'scroll', function(){
    if ($(window).scrollTop() > 100) {
      $('.scroll-top-wrapper').addClass('show');
    } else {
      $('.scroll-top-wrapper').removeClass('show');
    }
  });
  $('.scroll-top-wrapper').on('click', orgChartPlugin.scrollToTop);

  // Load any orgchart query-string searches on page load
  let search_orgchart_for = orgChartPlugin.getParameterByName('orgchart_search');
  if (search_orgchart_for) {
    $('#orgchart_search_box').val(search_orgchart_for);
    orgChartPlugin.searchOrgChart();
    if (history.replaceState) { // clear out the query from the URL
      history.replaceState(null, null, location.href.replace(/[?&]orgchart_search=[^&]+/, ''));
    }
  }

});
