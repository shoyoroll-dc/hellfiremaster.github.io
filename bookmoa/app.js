// 책 목록을 저장할 배열 초기화
let books = [
    {
        title: '자바스크립트 완벽 가이드',
        author: '헬마스터'
    },
    {
        title: '테크닉과 기술',
        author: '아스카영원히사랑해'
    },
    {
        // title: '자바스크립트 패턴과 테스트',
        title: '자바스크립트 패턴과 테스트',
        author: 'ㅇㅇ'
    }
];

// 책 등록 폼 제출 시 이벤트 처리
document.getElementById('book-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    // 입력된 책 제목과 저자 가져오기
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;

    // 새로운 책 객체 생성
    const newBook = {
        title: title,
        author: author
    };

    // 책 목록에 추가
    books.push(newBook);

    // 입력 필드 초기화
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';

    // 책 목록 업데이트
    updateBookList();
});

// 검색 입력 필드의 입력 이벤트 처리
document.getElementById('search').addEventListener('input', function() {
    updateBookList();
});

// 책 목록을 업데이트하여 화면에 표시하는 함수
function updateBookList() {
    const bookList = document.getElementById('book-list');
    const searchQuery = document.getElementById('search').value.toLowerCase();
    bookList.innerHTML = ''; // 기존 목록 초기화

    // 검색어에 맞는 책만 필터링하여 표시
    books
        .filter(function(book) {
            return book.title.toLowerCase().includes(searchQuery) || 
                   book.author.toLowerCase().includes(searchQuery);
        })
        .forEach(function(book) {
            const li = document.createElement('li');
            li.textContent = `제목: ${book.title}, 저자: ${book.author}`;
            bookList.appendChild(li);
        });
}

updateBookList();
