:root{
    --pink: #cd29aa;
    --violet: #7f6eb2;
    --dark: #1A1A1A
}

.card  {
    border-radius: 15px;
    width: 100%; 
    max-width: 220px; 
    background-color: var(--dark);
    margin: 0 auto;
    margin-bottom: 15px;
    transition: 0.5s;
}
body.light-mode .card{
    background-color: #f5f5f5;
}
.card:hover {
    transform: translateY(-3px);
    transition: 0.5s;
    box-shadow: 0 10px 20px rgba(255, 76, 139, 0.2);
}
body.light-mode .card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

}
.basicInfo{
    background: linear-gradient(45deg, #3A1C71, #D76D77);
    border-radius: 15px;
    padding: 12px; 
    position: relative;
}
.title .category,
.title .info{
    font-weight: 600;
    font-size: 9px;
}
.title .name{
    font-weight: bold;
    font-size: 14px;
    padding-bottom: 2px;
}
.card .img{
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 10px 0 15px 0;
}
.card .img img{
    width: 95%; 
    transform: scale(1);
    border-radius: 8px;
    transition: 0.5s;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
}
.begin{
    background-color: #cd29aa;
    width: 45px;
    height: 25px; 
    border-radius: 8px;
    font-size: 8px;
    cursor: pointer;
    transform: scale(1);
}
.begin .name{
    text-align: center;
    padding-top: 6px;
}
.mores{
    padding: 12px;
}
body.light-mode .mores{
    background-color: #f5f5f5;
    border-radius: 15px;
}
.mores .stars,
.mores .price{
    display: inline-block;
    font-size: 10px;
}
.mores .price{
    float: right;
    color: #eee;
    font-weight: 600;
    letter-spacing: 1px;
}
body.light-mode .mores .price{
    color: var(--dark);
}
.mores .stars{
    color: #9b9a9a;

}
.text-yellow{
    color: #F9D86E;
}
.addcard{
    position: relative;
    width: 100%;
    height: 35px; 
    cursor: pointer;
}
.addcard i {
    position: absolute;
    width: 28px;
    height: 28px;
    background-color: var(--pink);
    color: #222;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    right: 85px;
    bottom: -30px;
    border: 3px solid var(--dark);
    transition: 0.5s;
    opacity: 0;
    transform: translate(0, 10px);
    font-size: 14px;
}
body.light-mode .addcard i{
    background-color: #f5f5f5;
    color: var(--pink);
    border: 3px solid #7a0e80;
}
.addcard::after,
.addcard::before{
    position:absolute;
    bottom: -11.7px;
    background: transparent;
    width: 16px;
    height: 16px;
    content: '';
    right: 71px;
    border-bottom-left-radius: 55%;
    box-shadow: 0 12px 0 0 var(--dark);
    opacity: 0;
    transform: translate(0,20px);
    transition: 0.5s;
}
body.light-mode .addcard::after,
body.light-mode .addcard::before{
    z-index: -1;
    box-shadow: 0 12px 0 0 #f5f5f5;
}
.addcard::after{
    right: unset;
    left: 63px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 55%;
}

.card:hover .img img{
    transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}
.card:hover .addcard i,
.card:hover .addcard::before,
.card:hover .addcard::after{
    opacity: 1;
    transform: translate(0,0);
}
.begin:hover{
    transform: scale(1.1);
    transition: 0.3s;
}
@media (max-width: 1200px) {
    .courses-row {
        grid-template-columns: repeat(3, 1fr); 
    }
}

@media (max-width: 900px) {
    .courses-row {
        grid-template-columns: repeat(2, 1fr); 
    }
    .addcard::after,
    .addcard::before{
        bottom: -11.9px;  
    }
}

@media (max-width: 600px) {
    .courses-row {
        grid-template-columns: 1fr;
    }
    
    .card {
        max-width: 260px;
    }
    .addcard::after{
        left: 85px;
    }
    .addcard::after,
    .addcard::before{
        right: 88px;
    }
    .addcard i{
        right: 103px;
    }
}
