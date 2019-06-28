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
                <?= $this->phone; ?>
                <?php if ($this->phone && $this->location) : ?>
                    &#124;
                <?php endif; ?>
                <?= $this->location; ?>
                <?php if ($link_to_path && ($this->phone || $this->location)) : ?>
                    &#124; <a href='<?= $link_to_path . '#' . $this->slug ?>' title='show on org chart'><i class="fa fa-users"></i></i></a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        <?php if ($this->email) : ?>
            <div class='orgchart-email'><a href='mailto:<?= $this->email; ?>'><?= $this->email; ?></a></div>
        <?php endif; ?>
        <?php if (!empty($this->tags)) : ?>
            <div class='tags'>
                <div class='badge'>
                    <?= implode("</div><div class='badge'>", $this->tags); ?>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>