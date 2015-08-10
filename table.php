<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv='Content-type' content='text/html; charset=utf-8'>
    <title>Example</title>
    <?php include '_head.htm'; ?>
  </head>
  <body>

    <?php include '_menu.htm'; ?>
    <section style="margin:20px;">
        ChooseTable
        <div id="content"></div>
    </section>

    <script type="text/jsx" src="dist/react-stargazer/table.js"></script>
    <script type="text/jsx">
        var Main = React.createClass({
            // --------------------------------------------------------------------------------
            // event
            // --------------------------------------------------------------------------------
            getRows() {
                return {
                    headKey: 'id',
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

            getRows2() {
                // 假設是 ajax 的過程
                var table = this.state.table;
                /*
                    table.heads = ['name','price'];
                    ->
                    Uncaught Error: Invariant Violation: processUpdates(): Unable to find child 2 of element.
                    This probably means the DOM was unexpectedly mutated (e.g., by the browser),
                    usually due to forgetting a <tbody> when using tables, nesting tags like <form>, <p>, or <a>,
                    or using non-SVG elements in an <svg> parent.
                    Try inspecting the child nodes of the element with React ID `.0.0.1.0`.
                */
                table.rows = [
                    { id: 12, name: "iPhone 5",   price: 199,   stocked: false   },
                    { id: 13, name: "iPhone 6",   price: 299,   stocked: true    },
                    { id: 14, name: "iPhone 6s",  price: 399,   stocked: true    },
                ];
                this.setState({"table": table});
            },

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
                        <Sg.Table
                            data={this.state.table}
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
    </script>


  </body>
</html>
