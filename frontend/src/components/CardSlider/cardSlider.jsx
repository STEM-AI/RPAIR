import React from 'react';

const CardSlider = () => {
  const cardsData = [
    {
      image: require('../../assets/imgs/vexComp/AI.jpg'),
      title: 'Artificial Intelligence competitions',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
    },
    {
      image: require('../../assets/imgs/vexComp/aurdoino.jpg'),
      title: 'Electronics and Arduino competitions',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
    },
    {
      image: require('../../assets/imgs/vexComp/vexv5.jpg'),
      title: 'VEX V5',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
    },
    {
      image: require('../../assets/imgs/vexComp/vexiq.jpg'),
      title: 'VEX iQ',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
    },
    {
      image: require('../../assets/imgs/vexComp/mobile.jpg'),
      title: 'Mobile Applications competitions ',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
    },
    {
      image: require('../../assets/imgs/vexComp/web.webp'),
      title: 'Website Design competitions ',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
    }
  ];

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-10 md:px-20">
  <div className="col-span-full flex justify-center items-center mb-8">
    <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-teal-500 text-5xl font-black">
      RPAIR CHALLENGES
    </h2>
  </div>
  {cardsData.map((card, index) => (
    <div
      key={index}
      className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${card.image})` }}
      />
      <div className="p-4">
        <div className="text-xl font-bold text-cyan-700 mb-2">{card.title}</div>
        <p className="text-gray-500 text-sm">{card.description}</p>
      </div>
    </div>
  ))}
</div>

  );
};

export default CardSlider;

