<span class='orgchart-anchor' id='<?php echo $this->slug;?>'></span>
<span class='orgchart-name' data-tags='<?php echo implode(',',$this->tags);?>'><?php echo $this->name;?></span>
<?php if($this->headshot || $this->placeholderimg): ?>
    <div class="orgchart-headshot">
        <?php if ($this->headshot): ?>
            <?php echo $this->headshot; ?>
        <?php else: ?>
            <?php echo $this->placeholderimg; ?>
        <?php endif; ?>
    </div>
<?php endif; ?>
<?php if ($this->title): ?>
    <div class='orgchart-title'><?php echo $this->title;?>&nbsp;</div>
<?php else: ?>
    &nbsp;<a href="<?php echo $link_to_path . '?node=' . $this->slug; ?>" title=""><i class="fa fa-sitemap"></i></a>
<?php endif; ?>
<?php if ($this->phone || $this->location || $this->slug): ?>
    <div class='orgchart-phone-number'>
        <?php echo $this->phone; ?> 
        <?php if ($this->phone && $this->location): ?>
        &#124; 
        <?php endif; ?>
        <?php echo $this->location;?>
        <?php if ($link_to_path && ($this->phone || $this->location)): ?>
            &#124; <a href='<?php echo $link_to_path . '#' . $this->slug?>'><i class="fa fa-users"></i></i></a>
        <?php endif; ?>
    </div>
<?php endif; ?>
<?php if ($this->email): ?>
    <div class='orgchart-email'><a href='mailto:<?php echo $this->email;?>'><?php echo $this->email;?></a></div>
<?php endif; ?>
<?php if (!empty($this->tags)): ?>
    <div class='tags'>
        <div class='badge'>
            <?php echo implode("</div><div class='badge'>", $this->tags);?>
        </div>
    </div>
<?php endif; ?>