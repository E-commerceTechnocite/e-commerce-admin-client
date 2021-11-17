const myChart = document.getElementById('myChart').getContext('2d')
const massPopChart = new Chart(myChart,{
    type:'line',
    data: {
        labels:['June','July','August','September','October','November'],
        datasets:[{
            label:'Sales',
            data:[
                214184,
                181184,
                198188,
                157560,
                174500,
                188000,
            ],
            backgroundColor:[
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(92, 100, 35, 0.6)',
                'rgba(155, 55, 25, 0.6)'
            ],
            borderWidth: 1,
             borderColor: '#555'
        }]
    },
    options: {
        title:{
            display: true,
            text:'Sales',
            fontSize:25,
        },
        legend: {
            display: false,
            position:'right',
            labels:{
                fontColor:'#000'
            }
        },
        layout:{
            padding: {
                left:50,
                right:0,
                bottom:0,
                top:0
            }
        },
        tooltips:{
            enabled: false
        }
    }
})