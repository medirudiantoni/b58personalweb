var form = document.getElementById('my-form');
var formButton = document.querySelector('#my-form button');

function onSubmit(e){
    e.preventDefault();
    // var inputNameValue = form['name'].value;
    // var emailValue = form['email'].value;
    // var phoneNumberValue = form['phone-number'].value;
    var inputNameValue = document.getElementById('name').value;
    console.log(inputNameValue);

    var subjectValue = form['subject'].value;
    var messageValue = form['message'].value;

    var body = messageValue;

    var hrefLink = `mailto:medirudiant@gmail.com?subject=${encodeURIComponent(subjectValue)}&body=${encodeURIComponent(body)}`;

    window.location.href = hrefLink;
}

form.addEventListener('submit', onSubmit);