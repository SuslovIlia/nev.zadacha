update()
document.querySelector('.notification__form button').addEventListener('click',
    function(){
        let time = document.querySelector('.notification__form input').value
        let masadge = document.querySelector('.notification__form textarea').value

        let info = document.querySelector('.notification__info')

        if(!time || !masadge){
            info.textContent = "Укажите время и сообщение"
            info.style.opacity = 1

            setTimeout(( ) =>{
                info.style.opacity = 0
            }, 2000 )
            setTimeout(()=>{
                info.textContent = ""
            }, 3000)
            return
        }
        localStorage.setItem(time,masadge)
        update()
    })

//  < - указываем именно дочерний элемент button
document.querySelector('.notification__list > button').addEventListener('click',
    function(){
        if(localStorage.length && confirm("Очистить список уведоилений ?")){
            localStorage.clear() // очищаем локал сторедж
            update()
            document.querySelector('.notification__list ').hidden = true
        }else if (!localStorage.length){
            alert("Уведомления отсутствуют!")
        }
})

function update(){
    if (!localStorage.length){
        document.querySelector('.notification__list ').hidden = true
    }else{
        document.querySelector('.notification__list ').hidden = false
    }
    document.querySelector('.notification__list > div').innerHTML = ""
    document.querySelector('.notification__info').textContent = ""

    for(let key of Object.keys(localStorage)){
        document.querySelector('.notification__list > div').insertAdjacentHTML
        ('beforeend', `
            <div class="notification__item">
                <div>${key} - ${localStorage.getItem(key)}</div>
                <button data-time="${key}">&times;</button>
            </div>
            `)
    }
    document.querySelector('.notification__form input').value = ""
    document.querySelector('.notification__form textarea').value = ""

    if(document.querySelector('.audioAlert')){
        document.querySelector('.audioAlert').remove()
    }
}

document.querySelector('.notification__list').addEventListener('click',
    function(e){
        if(!e.target.dataset.time){
            return
        }else{
            localStorage.removeItem(e.target.dataset.time)
            update()
        }
    })


    setInterval(() => {
        const currentDate = new Date();
        const currentHour = String(currentDate.getHours()).padStart(2, '0');
        const currentMinute = String(currentDate.getMinutes()).padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;
    
        for (const key of Object.keys(localStorage)) {
            // Проверяем, что ключ имеет формат времени "HH:mm"
            if (!/^\d{2}:\d{2}$/.test(key)) continue;
    
            const [keyHour, keyMinute] = key.split(':').map(Number);
    
            if (key === currentTime || (keyHour === Number(currentHour) && keyMinute < Number(currentMinute))) {
                const notificationItem = document.querySelector(`button[data-time="${key}"]`)?.closest('.notification__item');
    
                if (notificationItem) {
                    notificationItem.classList.add('notification__warning');
                }
    
                // Проверка наличия и добавление аудио
                if (!document.querySelector('.audioAlert')) {
                    document.body.insertAdjacentHTML(
                        'afterbegin',
                        `<audio loop class="audioAlert" autoplay>
                            <source src="./source/alert.mp3" type="audio/mpeg">
                         </audio>`
                    );
    
                    const audio = document.querySelector('.audioAlert');
                    const playPromise = audio.play();
    
                    // Обработка ошибок воспроизведения
                    if (playPromise !== undefined) {
                        playPromise.catch((error) => {
                            console.error("Ошибка воспроизведения аудио:", error);
                            alert(
                                "Автовоспроизведение заблокировано вашим браузером. Нажмите 'ОК', чтобы разрешить звук."
                            );
                            audio.play(); // Повторная попытка после взаимодействия
                        });
                    }
                }
            }
        }
    }, 1000);