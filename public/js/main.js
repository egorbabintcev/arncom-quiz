$('.btn-callback').on('click', function(e) {
  e.preventDefault();
  const { target, action } = this.dataset;
  const animCfg = {
    duration: 0,
    done: function() { $(this).toggleClass('is-open') },
  }

  $('body').toggleClass('is-lock');
  switch (action) {
    case 'open':
      $(target).show(animCfg);
      break;
    case 'close':
      $(target).hide(animCfg);
      break;
  }
})

$('button.next-step').on('click', function(evt) {
  if (this.type === 'submit') return;

  evt.preventDefault();
  const curStep = $(this).parents('.quiz-step');
  const nextStep = curStep.next('.quiz-step');
  if (nextStep.hasClass('is-last')) {
    curStep.parents('.quiz-form-wrapper').addClass('last-step');
  }
  curStep.removeClass('is-active');
  nextStep.addClass('is-active');
})

$('.switch').on('change', function() {
  $(this).parents('.quiz-step').find('button.next-step[disabled]').prop('disabled', false);
});

$('form input[name="url"]').prop('value', window.location.href);

$('form').on('submit', function(evt) {
  const data = $(this).serialize();

  $.ajax({
    type: 'POST',
    url: '/php/submit.php',
    data,
    success: (res) => console.log(res),
  });
})
