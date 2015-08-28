(function () {
    'use strict';

    let Main = React.createClass({
        // --------------------------------------------------------------------------------
        // data
        // --------------------------------------------------------------------------------
        getRows() {
            return {
                heads: ['name','price','stocked'],
                rows: [
                        { id: 11, name: "Football",    price: 49.99,  stocked: true,                        },
                        { id: 12, name: "Baseball",    price: 9.99,   stocked: true,                        },
                        { id: 13,                      price: 29.99,  stocked: false, name: "Basketball"    },
                        { id: 14, name: "iPod Touch",  price: 99.99,  stocked: true,                        },
                        { id: 27, name: "iPhone 5",    price: 399.99, stocked: false                        },
                        { id: 28, name: "Nexus 7",     price: 199.99, stocked: true                         },
                ],
            }
        },

        // 假設是 ajax 的過程
        getRows2() {
            this.state.table.rows = [
                { id: 12, name: "iPhone 5",   price: 199,   stocked: false   },
                { id: 13, name: "iPhone 6",   price: 299,   stocked: true    },
                { id: 14, name: "iPhone 6s",  price: 399,   stocked: true    },
            ];
            this.setState({"table": this.state.table});
        },

        // --------------------------------------------------------------------------------
        // event
        // --------------------------------------------------------------------------------
        rowChange(row) {
            if ( row.stocked === true ) {
                row.stocked = 'TRUE';
            }
            return row;
        },

        // --------------------------------------------------------------------------------
        getInitialState() {
            return {
                table: this.getRows(),
            };
        },

        render() {
            return (
                <div>
                    <TableShow
                        {...this.state.table}
                        handleRow={this.rowChange}
                    />

                    <button className="btn btn-primary" onClick={this.getRows2}>
                        get rows 2
                    </button>
                </div>
            );
        },
    });
    React.render(<Main />, document.getElementById('content'));

})();
