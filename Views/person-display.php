<?php
/**
 * Template part for displaying a Person custom post type
 */
extract($person_options);
$person_titles = $person->titles;
$person_departments = $person->departments;
$person_phone_and_location = $person->phone_and_location;
$person_email = $person->_person_email;
$person_url = $person->_person_url;
$person_url_title = $person->_person_url_title;
$person_url2 = $person->_person_url2;
$person_url_title2 = $person->_person_url_title2;
?>
<div class="<?= $class ?>">
  
  <div class="person-info">
    
    <h2 class="person-name">
      <?php the_title(); ?>
    </h2>
    
    <?php if($this->show_avatar): ?>
      <?php if(has_post_thumbnail()): ?>
          <?php the_post_thumbnail('thumbnail', ['class', 'person-avatar']); ?>
      <?php else: ?>
          <?php echo '<img class="person-avatar" alt="' . get_the_title() . '" src="' . plugin_dir_url( __DIR__)  . 'public/images/avatar-placeholder.png">'; ?>
      <?php endif; ?>
    <?php endif; ?>

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

    <ul class="person-links">
      <?php if($person_email): ?>
        <li class="email">
          <?= ($mail_link) ? "<a href='mailto:{$person_email}'>" : "" ?><?= $person_email ?><?= ($mail_link) ? "</a>" : "" ?>
        </li>
      <?php endif; ?>
      <?php if($person_url): ?>
      <li class="url">
        <a href="<?= $person_url ?>"><?= ($person_url_title) ? $person_url_title : $person_url?></a>
      </li>
    <?php endif; ?>

    <?php if($person_url2): ?>
      <li class="url">
        <a href="<?= $person_url2 ?>"><?= ($person_url_title2) ? $person_url_title2 : $person_url2?></a>
      </li>
    <?php endif; ?> 
    </ul>

  </div> <!-- /.person-info -->

</div> <!-- /.person -->