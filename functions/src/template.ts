// language=HTML
export const template: string = `
    <style>

        .content {
            max-width: 632px;
            margin: auto;
            padding: 16px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            box-sizing: border-box;
            border-radius: 4px;
        }

        .content .logo {
            display: block;
            width: 200px;
            margin: auto;
        }

        img {
            width: 100%;
        }

        .products, .optional-products {
            display: flex;
            flex-wrap: wrap;
        }

        .products .product, .optional-products .product {
            display: flex;
            flex-direction: column;
            flex-basis: 200px;
            padding: 2px;
            box-sizing: border-box;

        }

        .product-content {
            display: flex;
            flex-direction: column;
            border: 1px solid gray;
            border-radius: 2px;
            padding: 0 8px;
            flex-grow: 1;
        }

        .product h3 {
            font-size: 14px;
        }

        .products-title, .optional-products-title {
            font-size: 18px;
            padding-top: 8px;
        }

        .figure {
            max-height: 200px;
            display: flex;
        }

        .instances-question label, .measurement-label {
            display: flex;
            justify-content: space-between;
            border: 1px solid #cacaca;
            padding: 4px;
            margin: 2px 0;
            border-radius: 2px;
        }

        .instances-question label > *, .measurement-label > * {
            display: flex;
            flex-basis: 50%;
            border-left: 1px solid #cacaca;
            padding-left: 4px;
        }


    </style>

    <div class="content">
        <img class="logo" src="https://lucrareamea.ro/wp-content/uploads/2019/10/Logo-Lucrareamea-redim.png">

        <h1><%= title%></h1>
        <%- content %>
        <%- displayedSections %>

        <br>

        <%if (requiredProductsTotal > 0) { %>
        <h2 class="products-title">Produse necesare (<%= requiredProductsTotal %> lei)</h2>
        <div class="products">
            <% requiredProducts.forEach(function(product){ %>
            <div class="product">
                <div class="product-content">
                    <h3><a target="_blank" href="<%= product.url %>"><%= product.headline %></a> x <%=
                        productQuantities[product.uuid] %></h3>
                    <figure>
                        <img src="<%= product.imageUrl %>"/>
                    </figure>
                </div>
            </div>
            <% }); %>
        </div>
        <% } %>

        <%if (optionalProductsTotal > 0) { %>
        <h2 class="optional-products-title">Produse opționale (<%= optionalProductsTotal %> lei)</h2>
        <div class="optional-products">
            <% optionalProducts.forEach(function(product){ %>
            <div class="product">
                <div class="product-content">
                    <h3><a target="_blank" href="<%= product.url %>"><%= product.headline %></a> x <%=
                        productQuantities[product.uuid] %></h3>
                    <figure>
                        <img src="<%= product.imageUrl %>"/>
                    </figure>
                </div>
            </div>
            <% }); %>
        </div>
        <% } %>
    </div>

`;
