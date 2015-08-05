'use strict';

var Sg = Sg || {};
Sg.Pagination = React.createClass({

    propTypes: {
        handlePage: React.PropTypes.func
    },

    /**
     *  第一次將資料傳進來的時候
     *  把資料結合元件的預設值
     */
    getInitialState() {
        let def = {
            page: 1,
            pageShowCount: 10,  // 每頁顯示幾筆資料 (用來計算總共有多少page)
            rowCount: 0,        // 總筆數
            prev: true,
            next: true,
            first: false,
            last: true,
            gap: 5,             // 顯示5個  << < 1 2 3 4 5 > >>
        };
        for (let key in def) {
            if( typeof(this.props.data[key])!=="undefined" ) {
                def[key] = this.props.data[key];
            }
        }
        return def;
    },

    getTotalPage() {
        return Math.round(this.state.rowCount / this.state.pageShowCount);
    },

    /**
     *  取得要顯示哪幾頁 page
     *  @return array
     */
    getShowPages() {
        let total = this.getTotalPage();
        let start, stop;
        if ( total >= this.state.gap ) {
            // 顯示 gap 的數量
            // 必須要計算 active page 在中間的位置
            start = this.state.page - Math.floor(this.state.gap/2);
            if ( start < 1 ) {
                start = 1;
            }
            stop = start + this.state.gap - 1;
            if ( stop > total ) {
                stop  = total;
                start = total-this.state.gap+1; // 開始的頁數要回補, 不然在尾頁的數量會少於 gap
            }
        }
        else {
            // 顯示間距若少於 gap, 那麼就都顯示
            start = 1;
            stop  = total;
        }

        let arr = new Array();
        let index = 0;
        for ( let i=start; i<=stop; i++ ) {
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
    handlePage: function(p) {
        if ( p < 1 ) {
            p = 1;
        }
        else if ( p > this.getTotalPage() ) {
            p = this.getTotalPage();
        }

        // custom event
        if (this.props.handlePage) this.props.handlePage(p);

        this.setState({page: p});
    },

    // --------------------------------------------------------------------------------
    // render
    // --------------------------------------------------------------------------------
    render() {
        return (
            <ul className="pagination">
                {this.renderPrev()}
                {this.renderNext()}
                {this.getShowPages().map(this.renderPage, this)}
                {this.renderFirst()}
                {this.renderLast()}
            </ul>
        );
    },

    renderPrev: function() {
        if ( !this.state.prev ) {
            return;
        }
        let cls = this.state.page === 1 ? 'disabled' : '';
        return (
            <li className={cls} onClick={this.handlePage.bind(this, this.state.page-1)}>
                <a href="#">&laquo; Prev</a>
            </li>
        );
    },

    renderNext: function() {
        if ( !this.state.next ) {
            return;
        }
        let cls = this.state.page === this.getTotalPage() ? 'disabled' : '';
        return (
            <li className={cls} onClick={this.handlePage.bind(this, this.state.page+1)}>
                <a href="#">Next &raquo;</a>
            </li>
        );
    },

    renderFirst: function() {
        if ( !this.state.first ) {
            return;
        }
        if ( -1 !== this.getShowPages().indexOf(1) ) {
            return;
        }
        return (
            <li onClick={this.handlePage.bind(this, 1)}>
                <a href="#">...1</a>
            </li>
        );
    },

    renderLast: function() {
        if ( !this.state.last ) {
            return;
        }
        let total = this.getTotalPage();
        //if ( this.state.page === total ) {
        //    return;
        //}
        if ( -1 !== this.getShowPages().indexOf(total) ) {
            return;
        }
        return (
            <li onClick={this.handlePage.bind(this, total)}>
                <a href="#">...{total}</a>
            </li>
        );
    },

    renderPage: function(n, i) {
        let cls = this.state.page === n ? 'active' : '';
        return (
            <li key={i} className={cls} onClick={this.handlePage.bind(this, n)}>
                <a href='#'>{n}</a>
            </li>
        );
    }

});
