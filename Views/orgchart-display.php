<?php if($show_search): ?>
<div id="orgchart_search">

    <input id="orgchart_search_box" type="search" placeholder="Search…">
    <!-- <input id="orgchart_search_btn" type="button" value="Search"> -->
    <button type="submit" id="orgchart_search_btn"><i class="fa fa-search"></i></button>
    <!-- <input id="orgchart_search_clr" type="button" value="Clear"> -->
    <button type="submit" id="orgchart_search_clr"><i class="fa fa-times"></i></button>
    <div id="orgchart_search_results"></div>
</div>
<?php endif; ?>

<?php if($show_graphical): ?>
<a id="org_img" src="" download="OrgChart.png"></a>
<!-- configurable parameters for customizing graphical orgchart -->
<?php if($show_settings && ($show_startwith || $show_depth || $show_color || $show_contact)): ?>
<div id="action-panel">
    <?php if($show_customize): ?>
        <span>
            <button type="button" id="customize-btn" class="customize-btn-default action-panel-btn"><i class="fa fa-cog action-icon-left" aria-hidden="true"></i>Customize<i class="fa fa-caret-down action-icon-right" aria-hidden="true"></i></button>
        </span>
        <?php if($show_export): ?>
            <span>
                <?php include('orgchart-export-btn.php' ); ?>
            </span>
        <?php endif; ?>
    <?php endif; ?>
    
    <?php if($show_customize): ?> <!-- configurable parameters -->
    <div id="custom-panel"> 
    <?php else: ?>
    <div id="custom-panel" class="show">
    <?php endif; ?>
        <?php if($show_startwith): ?>
            <!-- drop down for select root node -->
            <div class="select-node">
                <div> 
                    <label for="select-root-node">Starting with</label>
                    <!-- drop down list for root node - options will be set dynamically -->
                </div>
                <div class="custom-item">
                    <select id="select-root-node">
                    </select>
                </div>
            </div>
        <?php endif; ?>

        <?php if($show_depth): ?>
            <!-- slider for adjusting vertical depth -->
            <div class="adjust-layout">
                <div>
                    <label> adjust layout </label>   
                </div>
                <div>
                    <input type="range" min="2" max="8" step="1" id="select-vert-depth" value="<?= $initial_depth ?>">
                </div>
            </div>
        <?php else: ?>
            <input type="hidden" min="2" max="8" step="1" id="select-vert-depth" value="<?= $initial_depth ?>">
        <?php endif; ?>

        <?php if($show_color): ?>
            <!-- drop down list of background colors -->

            <div class="select-color">
                <label for="select-bg-color">with a background color of </label>
                <!-- drop down list for background -->
                <select id="select-bg-color">
                    <option selected value="rgba(0,0,0,0)">Transparent</option>
                    <option value="rgb(255,255,255)">White</option>
                    <option value="rgb(0,133,66)">Eco-Green</option>
                    <option value="rgb(105,190,40)">Sapling-Green</option>
                    <option value="rgb(201,221,3)">Seedling-Green</option>
                </select>
            </div>

        <?php endif; ?>

        <div class="action-buttons">
            <?php if($show_contact): ?>
                <div>
                    <button type="button" id="contact-btn" class="action-panel-btn"><i class="fa fa-phone"></i> Show Contact</button>
                </div>
            <?php endif; ?>

            <?php if($show_startwith || $show_depth || $show_color || $show_contact): ?>
                <div class="custom-btn-reset">
                    <button type="button" id="custom-panel-btn-reset" class="action-panel-btn">
                    <i class="fa fa-refresh action-icon-left" aria-hidden="true"></i>Reset</button>
                </div>
            <?php endif; ?>

            <?php if($show_customize): ?>
            <?php elseif($show_export): ?>
                <div>
                    <?php include('orgchart-export-btn.php' ); ?>
                </div>
            <?php endif; ?>
        </div>
    </div> <!-- configurable parameters -->
</div> <!-- action-panel -->
 <?php else: ?>
    <?php if($show_export): ?>
        <div id="orgchart-export-only" class="export-flex">
            <button type="button" id="export-btn" class="action-panel-btn export-only"><i class="fa fa-file-image-o action-icon-left"></i>Export</button>
        </div>
    <?php endif; ?>
    <input type="hidden" min="2" max="8" step="1" id="select-vert-depth" value="<?= $initial_depth ?>">
 <?php endif; ?>

 <input type="hidden" id="org-initialcontact" data-initialcontact="<?= $this->initialcontact ?>">

<div id="orgchart-graphical-container">
    <?php if($show_fullscreen): ?>
        <div class="fullscreen-container">
            <i class="fa fa-expand fullscreen-element" title="View Full Screen" aria-hidden="true"></i>
        </div>
    <?php endif; ?>
    <!-- div container for graphical orgchart -->
    <div id="orgchart_graphical"></div>
</div>
<?php endif; ?> <!-- END show_graphical -->

<?php if($show_tree): ?>
<div 
  id="orgchart" 
  data-expanded="<?= $this->expanded ?>"
  class="<?php echo ($show_search) ? 'searchable' : 'non-searchable' ?>"
>
    <ul>
    <?php foreach($org->getUnorganizedPeople() as $person): ?>
        <li>
            <?php echo $person->name; ?>,

            <?php if($show_avatar): ?>
                <?php if(has_post_thumbnail()): ?>
                    <?php the_post_thumbnail('thumbnail', ['class', 'person-avatar']); ?>
                <?php else: ?>
                    <?php echo '<img class="person-avatar" alt="' . get_the_title() . '" src="' . plugin_dir_url( __DIR__)  . 'public/images/avatar-placeholder.png">'; ?>
                <?php endif; ?>
            <?php endif; ?>
            
            <?php echo $person->title; ?>,
            <?php echo $person->phone; ?>,
            <?php echo $person->location; ?>,
            <?php echo $person->email; ?>,
            <?php if(!empty($person->tags)) { echo implode(';', $person->tags); } ?>
        </li>
    <?php endforeach; ?>
    </ul>
</div>
<?php endif; ?>

<?php if($show_scrolltop): ?>   
<div class="scroll-top-wrapper">
    <span class="scroll-top-inner">
        <i class="fa fa-2x fa-arrow-circle-up"></i>     
    </span>
</div>
<?php endif; ?>