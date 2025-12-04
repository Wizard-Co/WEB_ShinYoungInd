class ModalFinder {
    constructor() {
        this.modal = null;
        this.currentTarget = null;
        this.data = [];
        this.isInitialized = false;

        this.createModal();
        this.init();
    }

    createModal() {
        if (document.getElementById('modalFinder')) return;

        const modalHTML = `
             <div class="pf-modal-overlay" id="modalFinder">
             <div class="pf-modal-content">
             <div class="pf-modal-header">
             <h2 class="pf-modal-title">항목 선택</h2>
             <button class="pf-close-btn" id="closeModal">&times;</button>
            </div>
            <div class="pf-modal-body">
            <div class="pf-search-box">
            <input type="text" id="inputSearch" placeholder="검색..." class="pf-search-input">
            </div>
            <ul class="pf-finder-list" id="pfFinderList"></ul>
            </div>
            </div>
            </div>          `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('modalFinder');
    }

    init() {
        if (this.isInitialized) return;

        const btnClose = document.getElementById('closeModal');
        const inputSearch = document.getElementById('inputSearch');

        btnClose.addEventListener('click', () => this.close());

        //#region 닫기.열기
        // 배경 클릭시 닫기
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // ESC 키 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        //#endregion

// 통합검색
        inputSearch.addEventListener('input', (e) => {
            this.filterData(e.target.value);
        });

        this.isInitialized = true;
    }

// 모달 열기
    async open(options = {}) {
        this.currentTarget = options.target;

// 제목 변경 (옵션)
        if (options.title) {
            document.querySelector('.pf-modal-title').textContent = options.title;
        }

// 데이터 로드
        const data = await this.loadData(options.nLarge, options.sMiddle);

        //결과값 1개면 바로 input에 세팅
        if (data.length === 1) {
            const entries = Object.entries(data[0]);
            const id = entries[0][1];
            const name = entries[1][1];

            this.select(id, name);
            return;
        }

        this.modal.classList.add('active');
        document.getElementById('inputSearch').value = '';
        document.getElementById('inputSearch').focus();
        this.renderList(this.data);
    }

// 모달 닫기
    close() {
        this.modal.classList.remove('active');
        this.currentTarget = null;
    }

// 데이터 로드 (서버에서 가져오기)
    async loadData(nLarge, sMiddle) {
        try {

            const response = await fetch(`/modalfinder?nLarge=${nLarge}&sMiddle=${sMiddle || ''}`);

            if (!response.ok) throw new Error('데이터 로드 실패');

            const rawData = await response.json();
            this.data = rawData.map(item => {
                const values = Object.values(item);
                return {
                    id: values[0],
                    name: values[1],
                    original: item
                };
            });

            return this.data;
        } catch (error) {
            console.error('ModalFinder 데이터 로드 오류:', error);
            return [];
        }
    }

// 검색 필터링
    filterData(query) {
        const filtered = this.data.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.id.toLowerCase().includes(query.toLowerCase())
        );
        this.renderList(filtered);
    }

// 리스트 렌더링
    renderList(data) {
        const listElement = document.getElementById('pfFinderList');

        if (!data || data.length === 0) {
            listElement.innerHTML = '<div class="pf-no-results">검색된 항목이 없습니다.</div>';
            return;
        }

        listElement.innerHTML = data.map(wrapper => {
            const item = wrapper.original;
            const displayEntries = Object.entries(item).slice(1);
            const fields = displayEntries
                .map(([key, value]) => `
        <div class="pf-item-cell">
            <strong>${key}</strong>: ${value}
        </div>
    `)
                .join('');

            return `
            <li class="pf-finder-item" 
                data-id="${wrapper.id}" 
                data-name="${wrapper.name}">
                
                <div class="pf-item-row">${fields}</div>
            </li>
        `;
        }).join('');

        // 클릭 이벤트
        listElement.querySelectorAll('.pf-finder-item').forEach(li => {
            li.addEventListener('click', () => {
                const id = li.dataset.id;
                const name = li.dataset.name;
                this.select(id, name);
            });
        });
    }



// 값 선택
    select(id, name) {
        const target = this.currentTarget;

        // ① 일반 input
        if (target?.idField && target?.nameField) {
            const idInput = document.getElementById(target.idField);
            const nameInput = document.getElementById(target.nameField);
            // id와 txt 가 같을때(input 하나만 쓸때)
            if (idInput && idInput === nameInput) {
                idInput.value = name;
                idInput.dataset.id = id;
            } else { //hidden용 input 포함 2개 있을 때
                if (idInput) idInput.value = id;
                if (nameInput) nameInput.value = name;
            }

            if (target.onSelect) target.onSelect({id, name});

            if (nameInput) {
                nameInput.dispatchEvent(new Event('change', {bubbles: true}));
            }
        }

        // ② Tabulator 셀용
        else if (target?.tabCell) {
            const cell = target.tabCell;
            const row = cell.getRow();

            cell.setValue(name);
            if (target.updateID) {
                row.update({[target.updateID]: id});
            }
            if (target.onSelect) target.onSelect({id, name});
        }

        this.close();
    }

}

// ==========================================
// 전역 인스턴스 생성
// ==========================================
window.modalFinder = new ModalFinder();

// ==========================================
// 🎯 간편 사용 함수(input용)
// ==========================================
window.openModalFinder = function (txtID, txtName, nLarge, sMiddle, title) {
    window.modalFinder.open({
        target: {
            idField: txtID,
            nameField: txtName,
            onSelect: (data) => {
                console.log('선택됨:', data);
            }
        },
        nLarge: nLarge,
        sMiddle: sMiddle,
        title: title || '항목 선택'
    });
};
