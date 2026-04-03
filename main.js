// 1. Подключение к Supabase
const supabaseUrl = 'https://kkitnczeuwqzqmrlfkeh.supabase.co';
const supabaseKey = 'sb_publishable_LBbiI7jyVKrDF2B5XCu5FA_AJd2Kezj';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

async function renderInventory() {
    // 2. Запрос данных
    const { data, error } = await supabaseClient
        .from('inventory')
        .select('id, item_name, inv_number, price');

    if (error) {
        console.error("Ошибка базы данных:", error);
        return;
    }

    // 3. Создание таблицы
    const grid = new gridjs.Grid({
        columns: [
            { name: "ID", width: "80px" },
            { name: "Наименование" },
            { name: "Инв. номер" },
            { name: "Цена (грн)", width: "150px" }
        ],
        data: data.map(item => [
            item.id, 
            item.item_name, 
            item.inv_number,
            item.price
        ]),
        search: true,
        sort: true,
        pagination: { limit: 10 },
        language: {
            search: { placeholder: 'Начните ввод для поиска...' },
            pagination: {
                previous: 'Пред.',
                next: 'След.',
                showing: 'Показано',
                results: () => 'записей'
            }
        }
    }).render(document.getElementById("wrapper"));

    // 4. ОБРАБОТЧИК КЛИКА (Делегирование событий)
    // Этот метод работает ВСЕГДА, даже после поиска или смены страниц
    document.getElementById('wrapper').addEventListener('click', function(e) {
        // Ищем ближайшую строку TR к месту клика
        const tr = e.target.closest('.gridjs-tr');
        
        if (tr) {
            // Удаляем класс выделения у всех строк в этой таблице
            document.querySelectorAll('.gridjs-tr').forEach(row => {
                row.classList.remove('selected-row');
            });

            // Добавляем класс выделения именно этой строке
            tr.classList.add('selected-row');

            // Выводим данные в консоль для отладки
            console.log("Выбрана строка с данными:", tr.innerText);
        }
    });
}

// Запуск
renderInventory();