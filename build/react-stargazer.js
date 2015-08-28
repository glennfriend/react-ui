'use strict';

(function (myNameSpace) {
    'use strict';

    window[myNameSpace] = {

        /**
         *  get unique id
         */
        getUniqueId: function getUniqueId(prefix) {
            var s4 = function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };
            if (!prefix) {
                return s4() + s4() + s4() + s4();
            }
            return prefix + s4() + s4() + s4() + s4();
        },

        /**
         *  each
         *      - 可以代入 object & array
         *      - 在 callback 中使用 "return false" 將離開整個迴圈
         *
         */
        each: function each(obj, callback) {
            var isArray = false;
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                isArray = true;
            } else if (Object.prototype.toString.call(obj) !== '[object Object]') {
                return;
            }

            var value = undefined,
                i = 0,
                length = obj.length;

            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);
                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);
                    if (value === false) {
                        break;
                    }
                }
            }
            return obj;
        }

    };
})('utils');
'use strict';

/**
 *  InputDate
 *
 *      params:
 *
 *      code:
 *          <InputDate name="birthDate" />
 *
 */
var InputDate = React.createClass({
    displayName: 'InputDate',

    // TODO: 請分離 state & props
    getInitialState: function getInitialState() {
        return {
            'name': this.props.name,
            'combobox': {
                'width': '',
                'options': []
            }
        };
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------
    getElementWidth: function getElementWidth() {
        var dom = React.findDOMNode(this.refs.container);
        return dom.offsetWidth;
    },

    setElementValue: function setElementValue(value) {
        var dom = React.findDOMNode(this.refs.container);
        dom.value = value;
    },

    getElementValue: function getElementValue() {
        var dom = React.findDOMNode(this.refs.container);
        return dom.value;
    },

    /**
     *  驗証日期格式 yyyy-mm-dd
     */
    isValidDate: function isValidDate(date) {
        var matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(date);
        if (matches == null) {
            return false;
        }
        var d = matches[3];
        var m = matches[2] - 1;
        var y = matches[1];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
    },

    /**
     *  為日期 加 one day
     */
    getDatePlus: function getDatePlus(originDate, numDay) {
        var numDay = numDay || 1;

        var matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(originDate);
        if (matches == null) {
            return false;
        }

        var date = new Date(originDate);
        date.setDate(date.getDate() + numDay);

        var month = (date.getMonth() + 1).toString();
        if (month.length == 1) {
            month = '0' + month;
        }
        var day = date.getDate().toString();
        if (day.length == 1) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    },

    /**
     *  為日期 減 one day
     */
    getDateMinus: function getDateMinus(date) {
        return this.getDatePlus(date, -1);
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    handleKey: function handleKey(event) {

        // update combobox width
        this.state.combobox.width = this.getElementWidth();

        // 輸入 ↓ 的時候, 要跳到 ComboBox, 並且預選第一個項目
        if (event.keyCode == 40 && this.state.combobox.options.length > 0) {
            React.findDOMNode(this.refs.box).focus();
            React.findDOMNode(this.refs.box).selectedIndex = 0;
        }
        // 輸入 8 個數字時, 直接完成 yyyy-mm-dd 的格式設定
        else if (event.target.value.length == 8 && -1 === event.target.value.indexOf('-')) {

                var result = '';
                var guess = parseInt(event.target.value.substr(0, 2));
                if (guess >= 19) {
                    // guess yyyymmdd
                    result = event.target.value.substr(0, 4) + '-' + event.target.value.substr(4, 2) + '-' + event.target.value.substr(6, 2);
                } else {
                    // guess mmddyyyy
                    result = event.target.value.substr(4, 4) + '-' + event.target.value.substr(0, 2) + '-' + event.target.value.substr(2, 2);
                }
                this.setElementValue(result);
            }
            // 輸入英文字 的時候
            else if (event.target.value.match(/[a-z]/ig)) {
                    var date = new Date();
                    var yyyy = date.getFullYear().toString();
                    var mm = (date.getMonth() + 1).toString();
                    var dd = date.getDate().toString();
                    var format = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
                    var options = [[format, format + ' (today)']];

                    // update combobox options
                    this.state.combobox.options = options;

                    // update state
                    this.setState({ 'combobox': this.state.combobox });
                }
                // 當日期完整時, 輸入 ↑ 表示加日期
                else if (event.keyCode == 38) {
                        var value = this.getElementValue();
                        if (!this.isValidDate(value)) {
                            return;
                        }
                        this.setElementValue(this.getDatePlus(value));

                        //  游標位置
                        // event.stopPropagation()
                        // event.preventDefault();
                        // console.log(event.target.selectionStart);
                    }
                    // 當日期完整時, 輸入 ↓ 表示減日期
                    else if (event.keyCode == 40) {
                            var value = this.getElementValue();
                            if (!this.isValidDate(value)) {
                                return;
                            }
                            this.setElementValue(this.getDateMinus(value));
                        } else {
                            this.state.combobox.options = [];
                            this.setState({ 'combobox': this.state.combobox });
                        }
    },

    /**
     *  comboBox 選取之後觸發的 event
     */
    handleChoose: function handleChoose(value) {
        this.setElementValue(value);
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render: function render() {
        return React.createElement(
            'span',
            null,
            React.createElement('input', { type: 'text', name: this.props.name, ref: 'container', onKeyUp: this.handleKey, maxLength: '10', placeholder: 'yyyy-mm-dd' }),
            React.createElement(ComboBox, { data: this.state.combobox, listenChoose: this.handleChoose, ref: 'box' })
        );
    }

});

var ComboBox = React.createClass({
    displayName: 'ComboBox',

    getInitialState: function getInitialState() {
        return this.getDefault(this.props.data);
    },

    /**
     *  當一個掛載的組件接收到新的 props 的時候被調用
     */
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.state = this.getDefault(nextProps.data);
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------
    /**
     *  取得預設值
     *  如果參數中有相同的 key, 則覆蓋該值
     */
    getDefault: function getDefault(params) {
        var def = {
            'width': '',
            'maxOption': 5,
            'options': []
        };
        for (var key in def) {
            if (typeof params[key] !== "undefined") {
                def[key] = params[key];
            }
        }
        return def;
    },

    /**
     *  每次 "新" 產生的元件, unique id 將會不同
     */
    uniqueId: utils.getUniqueId(),

    getUniqueId: function getUniqueId(prefix) {
        return prefix + this.uniqueId;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    handKey: function handKey(event) {
        // console.log(event.type, event.keyCode, event.which, event.timeStamp, event.target.value);
        var ENTER_KEY = 13;

        if (event.keyCode == ENTER_KEY) {
            this.props.listenChoose(event.target.value);
            this.setState({ options: [] });
        }
    },

    handClick: function handClick(event) {
        this.props.listenChoose(event.target.value);
        this.setState({ options: [] });
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render: function render() {
        var id = this.getUniqueId('combobox-id-');
        var options = this.state.options;
        var selectSize = options.length > this.state.maxOption ? this.state.maxOption : options.length;

        var selectStyle = {};
        selectStyle['overflow'] = 'hidden';
        selectStyle['display'] = 'none';
        if (options.length > 0) {
            selectStyle['display'] = 'block';
        }

        if (this.state.width) {
            selectStyle['width'] = this.state.width;
        }

        return React.createElement(
            'select',
            { style: selectStyle, size: selectSize, onKeyUp: this.handKey, onClick: this.handClick },
            options.map(this.renderOption)
        );
    },

    renderOption: function renderOption(arr, index) {
        var value = arr[0];
        var show = arr[1];
        return React.createElement(
            'option',
            { key: index, value: value },
            show
        );
    }

});
'use strict';

var Pagination = React.createClass({
    displayName: 'Pagination',

    propTypes: {
        // props
        listenClick: React.PropTypes.func,
        pageShowCount: React.PropTypes.number,
        rowCount: React.PropTypes.number.isRequired,
        gap: React.PropTypes.number,
        show: React.PropTypes.string,
        showPrev: React.PropTypes.node,
        showNext: React.PropTypes.node,
        showFirst: React.PropTypes.node,
        showLast: React.PropTypes.node,
        // state
        page: React.PropTypes.number
    },

    getDefaultProps: function getDefaultProps() {
        return {
            pageShowCount: 15, // 每頁顯示幾筆資料 (用來計算總共有多少page)
            rowCount: 0, // 總筆數
            gap: 5, // 顯示多少可點擊頁數  << < 1 2 3 4 5 > >>
            show: 'prev next page', // 'prev next page first last'
            showPrev: React.createElement(
                'span',
                null,
                '‹ Prev'
            ),
            showNext: React.createElement(
                'span',
                null,
                'Next ›'
            ),
            showFirst: React.createElement(
                'span',
                null,
                '«'
            ),
            showLast: React.createElement(
                'span',
                null,
                '»'
            )
        };
    },

    getInitialState: function getInitialState() {
        return this.getDefault(this.props);
    },

    /**
     *  當一個掛載的組件接收到新的 props 的時候被調用
     */
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.state = this.getDefault(nextProps);
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------
    /**
     *  取得預設值
     *  如果參數中有相同的 key, 則覆蓋該值
     */
    getDefault: function getDefault(params) {
        var def = {
            page: params.page ? params.page : 1
        };
        return def;
    },

    /**
     *  檢查是否有指定字串
     *      example:
     *          "prev next page first last"
     */
    hasTag: function hasTag(tag) {
        if (-1 !== this.props.show.indexOf(tag)) {
            return true;
        }
        return false;
    },

    /**
     *  總共幾頁
     */
    getTotalPage: function getTotalPage() {
        return Math.ceil(this.props.rowCount / this.props.pageShowCount);
    },

    /**
     *  取得要顯示哪幾頁 page
     *      example:
     *          [5,6,7,8,9]
     *
     *  @return array
     */
    getShowPages: function getShowPages() {
        var total = this.getTotalPage();
        var start = undefined,
            stop = undefined;
        if (total >= this.props.gap) {
            // 顯示 gap 的數量
            // 必須要計算 active page 在中間的位置
            start = this.state.page - Math.floor(this.props.gap / 2);
            if (start < 1) {
                start = 1;
            }
            stop = start + this.props.gap - 1;
            if (stop > total) {
                stop = total;
                start = total - this.props.gap + 1; // 開始的頁數要回補, 不然在尾頁的數量會少於 gap
            }
        } else {
                // 顯示間距若少於 gap, 那麼就都顯示
                start = 1;
                stop = total;
            }

        var arr = new Array();
        var index = 0;
        for (var i = start; i <= stop; i++) {
            arr[index++] = i;
        }
        return arr;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    /**
     *  點擊任何有關頁數的功能
     */
    handlePage: function handlePage(p) {
        if (p < 1) {
            p = 1;
        } else if (p > this.getTotalPage()) {
            p = this.getTotalPage();
        }

        // custom event
        if (this.props.listenClick) {
            this.props.listenClick(p);
        }

        this.setState({ page: p });
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render: function render() {
        var tags = this.props.show.split(' ');
        var order = [];
        for (var index in tags) {
            switch (tags[index]) {
                case 'page':
                    order.push(this.getShowPages().map(this.renderPage));break;
                case 'prev':
                    order.push(this.renderPrev());break;
                case 'next':
                    order.push(this.renderNext());break;
                case 'first':
                    order.push(this.renderFirst());break;
                case 'last':
                    order.push(this.renderLast());break;
            }
        }
        return React.createElement(
            'ul',
            { className: 'pagination' },
            order
        );
    },

    renderPrev: function renderPrev() {
        if (!this.hasTag('prev')) {
            return;
        }
        if (this.state.page === 1) {
            return React.createElement(
                'li',
                { key: 'prev', className: 'disabled' },
                React.createElement(
                    'a',
                    { href: 'javascript:void(0)' },
                    this.props.showPrev
                )
            );
        }
        return React.createElement(
            'li',
            { key: 'prev', onClick: this.handlePage.bind(this, this.state.page - 1) },
            React.createElement(
                'a',
                { href: 'javascript:void(0)' },
                this.props.showPrev
            )
        );
    },

    renderNext: function renderNext() {
        if (!this.hasTag('next')) {
            return;
        }
        if (this.state.page === this.getTotalPage()) {
            return React.createElement(
                'li',
                { key: 'next', className: 'disabled' },
                React.createElement(
                    'a',
                    { href: 'javascript:void(0)' },
                    this.props.showNext
                )
            );
        }
        return React.createElement(
            'li',
            { key: 'next', onClick: this.handlePage.bind(this, this.state.page + 1) },
            React.createElement(
                'a',
                { href: 'javascript:void(0)' },
                this.props.showNext
            )
        );
    },

    renderFirst: function renderFirst() {
        if (!this.hasTag('first')) {
            return;
        }
        if (this.state.page === 1) {
            return React.createElement(
                'li',
                { key: 'first', className: 'disabled' },
                React.createElement(
                    'a',
                    { href: 'javascript:void(0)' },
                    this.props.showFirst
                )
            );
        }
        return React.createElement(
            'li',
            { key: 'first', onClick: this.handlePage.bind(this, 1) },
            React.createElement(
                'a',
                { href: 'javascript:void(0)' },
                this.props.showFirst
            )
        );
    },

    renderLast: function renderLast() {
        if (!this.hasTag('last')) {
            return;
        }
        var total = this.getTotalPage();
        if (this.state.page === total) {
            return React.createElement(
                'li',
                { key: 'last', className: 'disabled' },
                React.createElement(
                    'a',
                    { href: 'javascript:void(0)' },
                    this.props.showLast
                )
            );
        }
        return React.createElement(
            'li',
            { key: 'last', onClick: this.handlePage.bind(this, total) },
            React.createElement(
                'a',
                { href: 'javascript:void(0)' },
                this.props.showLast
            )
        );
    },

    renderPage: function renderPage(n, i) {
        if (!this.hasTag('page')) {
            return;
        }
        if (this.state.page === n) {
            return React.createElement(
                'li',
                { key: i, className: 'active' },
                React.createElement(
                    'a',
                    { href: 'javascript:void(0)' },
                    n
                )
            );
        }
        return React.createElement(
            'li',
            { key: i, onClick: this.handlePage.bind(this, n) },
            React.createElement(
                'a',
                { href: 'javascript:void(0)' },
                n
            )
        );
    }

});
'use strict';

var TableChoose = React.createClass({
    displayName: 'TableChoose',

    getInitialState: function getInitialState() {
        return this.getDefault();
    },

    getDefaultProps: function getDefaultProps() {
        return {
            headKey: '', // by heads, 一般來說會是放置資料的主鍵 example 'id' 'email'
            heads: [],
            rows: []
        };
    },

    // sort: [],       // by heads
    /**
     *  當一個掛載的組件接收到新的 props 的時候被調用
     */
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.state = this.getDefault();
        this.resetAllCheckbox();
    },

    /**
     *  在掛載結束之後馬上被調用。需要DOM節點的初始化操作應該放在這里
     */
    componentDidMount: function componentDidMount() {
        this.resetAllCheckbox();
    },

    /**
     *  在更新發生之後調用
     */
    componentDidUpdate: function componentDidUpdate() {},

    // --------------------------------------------------------------------------------
    // data
    // --------------------------------------------------------------------------------
    /**
     *  取得預設值
     */
    getDefault: function getDefault() {
        return {
            saveCheckbox: {}, // 儲存 checkbox item
            saveControlCheckbox: 0 };
    },

    // 控制 checkbox all 的功能
    // --------------------------------------------------------------------------------
    // item checkbox store
    // --------------------------------------------------------------------------------
    /**
     *  manager checkbox
     */
    getCheckbox: function getCheckbox(key, defaultValue) {
        key = key.toString();
        if (typeof this.state.saveCheckbox[key.toString()] == "undefined") {
            return defaultValue ? defaultValue : null;
        }
        return this.state.saveCheckbox[key.toString()];
    },

    setCheckbox: function setCheckbox(key, value) {
        key = key.toString();
        var originValue = this.getCheckbox(key);

        this.state.saveCheckbox[key.toString()] = value;
        this.setState({ saveCheckbox: this.state.saveCheckbox });
        this.updateControlIcon();

        // 供外部使用的 listenCheck 是否有建立
        if (!this.props.listenCheck) {
            return;
        }
        // 如果值無改變, 不會觸發外部 event
        if (originValue === value) {
            return;
        }
        // 如果值原本是 null, 將不會觸發, 所以在新建立參數時, 不會觸發 event
        if (null === originValue) {
            return;
        }
        this.props.listenCheck(key, value);
    },

    getAllCheckbox: function getAllCheckbox() {
        return this.state.saveCheckbox;
    },

    /**
     *  row checkbox 是否 全部都選
     */
    isAllCheck: function isAllCheck() {
        if (!this.state.saveCheckbox) {
            return false;
        }
        var result = true;
        utils.each(this.state.saveCheckbox, function (key, value) {
            if (value !== true) {
                result = false;
                return false; // is break
            }
        });
        return result;
    },

    /**
     *  row checkbox 是否 全部沒有選
     */
    isAllNotCheck: function isAllNotCheck() {
        if (!this.state.saveCheckbox) {
            return false;
        }
        var result = true;
        utils.each(this.state.saveCheckbox, function (key, value) {
            if (value !== false) {
                result = false;
                return false; // is break
            }
        });
        return result;
    },

    // --------------------------------------------------------------------------------
    // control checkbox store
    // --------------------------------------------------------------------------------
    /**
     *  get control checkbox icon
     *
     *  0 沒有任何點擊  的圖示  -> 囗
     *  1 部份點擊      的圖示  -> 囗 + 一
     *  2 全點擊圖      的圖示  -> 囗 + Ｖ
     *
     */
    getControlClassName: function getControlClassName() {
        switch (this.state.saveControlCheckbox) {
            case 1:
                return 'fa fa-lg fa-minus-square-o';
            case 2:
                return 'fa fa-lg fa-check-square';
            default:
                return 'fa fa-lg fa-square-o';
        }
    },

    /**
     *  依照現在 item checkbox 的狀態, 改變 control icon 
     */
    updateControlIcon: function updateControlIcon() {
        if (this.isAllCheck()) {
            this.state.saveControlCheckbox = 2;
        } else if (this.isAllNotCheck()) {
            this.state.saveControlCheckbox = 0;
        } else {
            this.state.saveControlCheckbox = 1;
        }
        this.setState({ saveControlCheckbox: this.state.saveControlCheckbox });
    },

    /**
     *  依照現在 control icon 的狀態, 在點擊該 icon 之後
     *  必須對 item checkbox 做狀態的變更
     *
     *  0 沒有任何點擊  的圖示 -> 2 全選取
     *  1 部份點擊      的圖示 -> 0 全取消
     *  2 全點擊圖      的圖示 -> 0 全取消
     *
     *  @return boolean
     */
    clickControlIcon: function clickControlIcon() {
        var control = undefined;
        switch (this.state.saveControlCheckbox) {
            case 1:
            case 2:
                this.state.saveControlCheckbox = 0;
                control = false;
                break;
            default:
                this.state.saveControlCheckbox = 2;
                control = true;
        }
        this.setState({ saveControlCheckbox: this.state.saveControlCheckbox });

        var that = this;
        utils.each(this.getAllCheckbox(), function (key, value) {
            that.setCheckbox(key, control);
        });
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------
    getRowKey: function getRowKey(index) {
        if (!this.props.rows[index]) {
            return null;
        }
        return this.props.rows[index][this.props.headKey].toString();
    },

    resetAllCheckbox: function resetAllCheckbox() {
        var headKey = this.props.headKey;
        var that = this;
        var key = undefined;
        utils.each(this.props.rows, function (index, obj) {
            key = obj[headKey];
            that.setCheckbox(key, false);
        });
    },

    /**
     *  引用者所需要的資訊
     */
    getInfo: function getInfo() {
        var numChoose = 0;
        utils.each(this.getAllCheckbox(), function (key, value) {
            if (value === true) {
                numChoose++;
            }
        });
        return {
            numChoose: numChoose,
            chooseItems: this.getAllCheckbox()
        };
    },

    validate: function validate() {
        if (!this.props.headKey) {
            console.log('table error: element headKey not found!');
            return false;
        }
        if (Object.prototype.toString.call(this.props.heads) !== '[object Array]') {
            return false;
        }
        if (Object.prototype.toString.call(this.props.rows) !== '[object Array]') {
            return false;
        }
        return true;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    /**
     *  管理點擊的 row 資訊
     */
    handleCheck: function handleCheck(key, event) {
        this.setCheckbox(key, event.target.checked);
    },

    handleCheckAll: function handleCheckAll() {
        this.clickControlIcon();
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render: function render() {
        if (!this.validate()) {
            return false;
        }
        var style = {
            "width": "20px"
        };

        var icon = this.getControlClassName();
        return React.createElement(
            'span',
            null,
            React.createElement(
                'table',
                { className: 'table table-condensed table-bordered table-hover' },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'th',
                        { style: style },
                        React.createElement('i', { className: icon, onClick: this.handleCheckAll })
                    ),
                    this.props.heads.map(this.renderHead)
                ),
                React.createElement(
                    'tbody',
                    null,
                    this.props.rows.map(this.renderRow)
                )
            )
        );
    },

    renderRow: function renderRow(row, i) {
        var key = this.getRowKey(i);
        var data = this._sortRowByHeadToArray(row, this.props.heads);
        var color = this.getCheckbox(key) ? 'info' : '';
        return React.createElement(
            'tr',
            { key: i, className: color },
            React.createElement(
                'td',
                null,
                React.createElement('input', {
                    type: 'checkbox',
                    key: i,
                    onChange: this.handleCheck.bind(this, key),
                    checked: this.getCheckbox(key) })
            ),
            data.map(this.renderCell)
        );
    },

    renderCell: function renderCell(data, i) {
        return React.createElement(
            'td',
            { key: i },
            data
        );
    },

    renderHead: function renderHead(title, i) {
        title = title.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        return React.createElement(
            'th',
            { key: i },
            title
        );
    },

    /**
     *  將 row object 重新依照 head 排序, 並且轉成 "二維陣列"
     *  注意, 是轉為二維陣列!
     *
     *      {name:'ken', age:20, birth:'2000-01-01'}
     *      ->
     *          [
     *              ['ken'],
     *              [20],
     *              ['2000-01-01']
     *          ]
     *
     *  @return Array
     */
    _sortRowByHeadToArray: function _sortRowByHeadToArray(row, heads) {
        var data = [];
        var index = 0;
        for (var idx in heads) {
            var _name = heads[idx];
            data[index++] = [row[_name]];
        }
        return data;
    }

});
'use strict';

var TableShow = React.createClass({
    displayName: 'TableShow',

    getDefaultProps: function getDefaultProps() {
        return {
            heads: [],
            rows: []
        };
    },

    // --------------------------------------------------------------------------------
    // helper
    // --------------------------------------------------------------------------------

    validate: function validate() {
        if (Object.prototype.toString.call(this.props.heads) !== '[object Array]') {
            return false;
        }
        if (Object.prototype.toString.call(this.props.rows) !== '[object Array]') {
            return false;
        }
        return true;
    },

    // --------------------------------------------------------------------------------
    // event
    // --------------------------------------------------------------------------------
    /**
     *  提供給外界處理 row
     */
    handleRow: function handleRow(row) {
        // custom event
        if (this.props.handleRow) {
            row = this.props.handleRow(row);
        }
        return row;
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render: function render() {
        if (!this.validate()) {
            return false;
        }
        return React.createElement(
            'span',
            null,
            React.createElement(
                'table',
                { className: 'table table-condensed table-bordered table-striped' },
                React.createElement(
                    'thead',
                    null,
                    this.props.heads.map(this.renderHead)
                ),
                React.createElement(
                    'tbody',
                    null,
                    this.props.rows.map(this.renderRow)
                )
            )
        );
    },

    renderRow: function renderRow(row, i) {
        row = this.handleRow(row);
        var data = this._sortRowByHeadToArray(row, this.props.heads);
        return React.createElement(
            'tr',
            { key: i },
            data.map(this.renderCell)
        );
    },

    renderCell: function renderCell(data, i) {
        return React.createElement(
            'td',
            { key: i },
            data
        );
    },

    renderHead: function renderHead(title, i) {
        title = title.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        return React.createElement(
            'th',
            { key: i },
            title
        );
    },

    /**
     *  將 row object 重新依照 head 排序, 並且轉成 "二維陣列"
     *  注意, 是轉為二維陣列!
     *
     *      {name:'ken', age:20, birth:'2000-01-01'}
     *      ->
     *          [
     *              ['ken'],
     *              [20],
     *              ['2000-01-01']
     *          ]
     *
     *  @return Array
     */
    _sortRowByHeadToArray: function _sortRowByHeadToArray(row, heads) {
        var data = [];
        var index = 0;
        for (var idx in heads) {
            var _name = heads[idx];
            data[index++] = [row[_name]];
        }
        return data;
    }

});