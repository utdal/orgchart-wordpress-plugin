<?php
// Directory Tree View - View For Individual Person Cards
?>
<span class='orgchart-anchor' id='<?= $this->slug; ?>'></span>
<div class="orgchart-person <?= ($show_avatar && !$this->hide_headshot) ? 'has-headshot' : '' ?>">
    <?php if ($show_avatar && !$this->hide_headshot) : ?>
        <div class="orgchart-headshot">
            <?= ($this->headshot) ? $this->headshotimg : $this->placeholderimg ?>
        </div>
    <?php endif; ?>

    <div class="orgchart-person-info">
        <span class='orgchart-name' data-tags='<?= implode(',', $this->tags); ?>'><?= $this->name; ?></span>
        <?php if ($this->title) : ?>
            <div class='orgchart-title'><?= $this->title; ?>&nbsp;</div>
        <?php else : ?>
            &nbsp;<a href="<?= $link_to_path . '?node=' . $this->slug; ?>" title="show on org chart"><i class="fa fa-sitemap"></i></a>
        <?php endif; ?>
        <?php if ($this->phone || $this->location || $this->slug) : ?>
            <div class='orgchart-phone-number'>
                <?php if ($this->phone) : ?>
                    <a href="tel:<?= $this->phone; ?>" class="no-desktop-link"><?= $this->phone; ?></a>
                <?php endif; ?>
                <?php if ($this->phone && $this->location) : ?>
                    &#124;
                <?php endif; ?>
                <?php if ($this->location) : ?>
                    <?= ($this->location_url) ? "<a href='{$this->location_url}' target='_blank' class='hide-default-icon'>" : "" ?>
                    <i class='fa fa-map-marker'></i> <?= $this->location ?>
                    <?= ($this->location_url) ? "</a>" : "" ?>
                <?php endif; ?>
                <?php if ($link_to_path && ($this->phone || $this->location)) : ?>
                    &#124; <a href='<?= $link_to_path . '#' . $this->slug ?>' class="hide-default-icon" title='show on org chart'><i class="fa fa-users"></i></i></a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        <ul class="orgchart-person-links">
            <?php if ($this->email) : ?>
                <li class='orgchart-person-link orgchart-email'>
                    <a href='mailto:<?= $this->email; ?>'><?= $this->email; ?></a>
                </li>
            <?php endif; ?>
            <?php if ($this->url) : ?>
                <li class='orgchart-person-link orgchart-url'>
                    <a href="<?= $this->url ?>"><?= ($this->url_title) ? $this->url_title : $this->url ?></a>
                </li>
            <?php endif; ?>
            <?php if ($this->url2) : ?>
                <li class='orgchart-person-link orgchart-url'>
                    <a href="<?= $this->url2 ?>"><?= ($this->url_title2) ? $this->url_title2 : $this->url2 ?></a>
                </li>
            <?php endif; ?>
        </ul>
        <?php if (!empty($this->tags)) : ?>
            <div class='tags'>
                <div class='badge'>
                    <?= implode("</div><div class='badge'>", $this->tags); ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>