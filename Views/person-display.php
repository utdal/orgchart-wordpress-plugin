<?php
/**
 * Template part for displaying a Person custom post type
 */
extract($person_options);
$person_titles = $person->titles;
$person_departments = $person->departments;
$person_phone_and_location = $person->phone_and_location;
$person_email = $person->_person_email;
?>
<div class="<?= $class ?>">

  <div class="person-pic">
    <?php the_post_thumbnail($image_size); ?>
  </div>

  <div class="person-info">

    <h2 class="person-name">
      <?php the_title(); ?>     
    </h2>

    <?php if($person_titles): ?>
      <h3 class="person-title">
        <?= implode(' <small>and</small> ', $person_titles); ?>
      </h3>
    <?php endif; ?>

    <?php if($person->_person_show_department): ?>
      <div class="person-department">
        <?= implode(', ', $person->departments); ?>
      </div>
    <?php endif; ?>

    <?php if($bio): ?>
      <div class="biography"><?php the_content(); ?></div>
    <?php endif; ?>

    <?php if($person_phone_and_location): ?>
      <h4 class="phone-and-location">
        <?php echo implode(' <span class="phone-location-separator"></span> ', $person_phone_and_location); ?>
      </h4>
    <?php endif; ?>

   <?php if($person_email): ?>
      <div class="email">
        <?= ($mail_link) ? "<a href='mailto:{$person_email}'>" : "" ?><span class="hide_large fa fa-envelope-o"></span> <span class="hide_small"><?= $person_email ?></span><?= ($mail_link) ? "</a>" : "" ?>
      </div>
    <?php endif; ?>

  </div> <!-- /.person-info -->

</div> <!-- /.person -->