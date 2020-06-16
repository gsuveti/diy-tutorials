// language=HTML
import {commonStyle} from './common-style.template';

export const productsEmailTemplate: string = `
    ${commonStyle}
    <style>
        .products, .optional-products {
            display: table;
            width: 100%;
        }

        .products .product, .optional-products .product {
            display: inline-block;
            width: 50%;
            padding: 2px;
            box-sizing: border-box;
        }


        .product-content {
            display: block;
            border: 1px solid gray;
            border-radius: 2px;
            height: 200px;
            padding: 0 8px;
            overflow: hidden;
        }

        .product h3 {
            font-size: 14px;
        }

        .products-title, .optional-products-title {
            font-size: 18px;
            padding-top: 8px;
        }


    </style>
    <div class="container">
        <div class="header">
            <img class="logo" src="https://lucrareamea.ro/wp-content/uploads/2019/10/Logo-Lucrareamea-redim.png">
        </div>
        <div class="content">

            <h1><%= title%></h1>

            <div class="py">
                <p class="p-none m-none">Revino la articol pentru etapele detaliate ale lucrării tale și pentru a
                    definitiva comanda</p>
                <a target="_blank" href="<%= tutorialUrl %>"><%= tutorialUrl %></a>
            </div>

            <%if (requiredProductsTotal > 0) { %>
            <div class="products">
                <h2 class="products-title py">Produse necesare (<%= requiredProductsTotal %> lei)</h2>

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
            <div class="optional-products py">
                <h2 class="optional-products-title">Produse opționale (<%= optionalProductsTotal %> lei)</h2>

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

            <p class="py">
                Este important să știi că prețul total al pachetului de produse este o estimare, costul final poate fi
                diferit, deoarece LucrareaMea.ro este o platformă independentă care îți oferă informații gratuit.
                Prețurile afișate sunt estimative, includ TVA și exclud costul de transport.
            </p>


            <div class="py">
                <p class="p-none m-none">Dacă te mai interesează și alte subiecte despre casă și pentru acasă, te rugăm
                    să accesezi</p>
                <a target="_blank" href="https://lucrareamea.ro/blog/">lucrareamea.ro/blog</a>
            </div>
        </div>

        <div class="footer">
            <p class="py">
                Ai primit acest email pentru că ai vizitat site-ul <a href="https://www.lucrareamea.ro">www.lucrareamea.ro</a>
                și ai optat să primești lista de produse gratuit pe mail. Dacă întâmpini vreo problemă, ai vreo
                nelămurire sau o sugestie te rugăm să ne contactezi pe email <a href="mailto: office@lucrareamea.ro">office@lucrareamea.ro</a>.
            </p>

            <p><strong>LucrareaMea.ro</strong> - DIY Projects Mkt SRL, Timișoara, str. Virgil Madgearu nr. 5.</p>
        </div>
    </div>
`;
