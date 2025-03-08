
// import React from 'react';
// import { Link } from 'react-router-dom'; 

// const CardSlider = () => {
//   const cardsData = [
//     {
//       image: require('../../assets/imgs/vexComp/AI.jpg'),
//       title: 'Artificial Intelligence competitions',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/aurdoino.jpg'),
//       title: 'Electronics and Arduino competitions',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/vexv5.jpg'),
//       title: 'VEX V5',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/vexiq.jpg'),
//       title: 'VEX IQ',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/mobile.jpg'),
//       title: 'Mobile Applications competitions ',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/web.webp'),
//       title: 'Website Design competitions ',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-10 md:px-20">
//       <div className="col-span-full flex justify-center items-center mb-8">
//         <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
//           RPAIR CHALLENGES
//         </h2>
//       </div>
//       {cardsData.map((card, index) => (
//         <Link to="/competitions" key={index} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
//           <div
//             className="w-full h-48 bg-cover bg-center"
//             style={{ backgroundImage: `url(${card.image})` }}
//           />
//           <div className="p-4">
//             <div className="text-xl font-bold text-cyan-700 mb-2">{card.title}</div>
//             <p className="text-gray-500 text-sm">{card.description}</p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default CardSlider;


// import React from 'react';
// import { Link } from 'react-router-dom'; 

// const CardSlider = () => {
//   const cardsData = [
//     {
//       image: require('../../assets/imgs/vexComp/AI.jpg'),
//       title: 'Artificial Intelligence competitions',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/arduino.jpg'),
//       title: 'Electronics and Arduino competitions',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/vexgo.jpg'),
//       title: 'VEX GO',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/vexiq.jpg'),
//       title: 'VEX IQ',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/mobile.jpg'),
//       title: 'Mobile Applications competitions ',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     },
//     {
//       image: require('../../assets/imgs/vexComp/web.jpeg'),
//       title: 'Website Design competitions ',
//       description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor, mi sed egestas tincidunt, libero dolor bibendum nisl, non aliquam quam massa id lacus.'
//     }
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-10 md:px-20">
//       <div className="col-span-full flex justify-center items-center mb-8">
//         <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black">
//           RPAIR CHALLENGES
//         </h2>
//       </div>
//       {cardsData.map((card, index) => (
//         <Link to="/competitions" key={index} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
//           <div
//             className="w-full h-48 bg-cover bg-center"
//             style={{ backgroundImage: `url(${card.image})` }}
//           />
//           <div className="p-4">
//             <div className="text-xl font-bold text-cyan-700 mb-2">{card.title}</div>
//             <p className="text-gray-500 text-sm">{card.description}</p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default CardSlider;

import React from 'react';
import { Link } from 'react-router-dom';

const CardSlider = () => {
  const cardsData = [
    {
      image: require('../../assets/imgs/vexComp/AI.jpg'),
      title: 'Artificial Intelligence Competitions',
      description: 'Explore the world of AI through exciting challenges that test your ability to develop intelligent systems and machine learning models.',
      link: '/competitions'
    },
    {
      image: require('../../assets/imgs/vexComp/open.jpg'),
      title: 'Open Source Competitions',
      description: 'Contribute to open-source projects, showcase your coding skills, and collaborate with developers worldwide to build innovative solutions.',
      link: '/OpenSource/competitions'
    },
    {
      image: require('../../assets/imgs/vexComp/robot.jpg'),
      title: 'Robotics Competitions',
      description: 'Design, build, and program robots to complete tasks and challenges, competing against other teams in innovative robotics events.',
      link: '/Robotics/Vex'
    },
    {
      image: require('../../assets/imgs/vexComp/mobile.jpg'),
      title: 'Mobile Applications Competitions',
      description: 'Develop cutting-edge mobile applications, enhance user experience, and solve real-world problems using the latest mobile technologies.',
      link: '/competitions'
    },
    {
      image: require('../../assets/imgs/vexComp/web.jpeg'),
      title: 'Website Design Competitions',
      description: 'Showcase your creativity in web design, develop responsive and interactive websites, and compete in front-end and back-end development challenges.',
      link: '/competitions'
    },

    {
      image: require('../../assets/imgs/vexComp/programming.webp'),
      title: 'Programming Competitions',
      description: 'the ability to perform mathematical calculations quickly and accurately in the mind without using a calculator or paper. It enhances problem-solving skills, memory, and concentration.',
      link: '/competitions'
    },
    {
      image: require('../../assets/imgs/vexComp/fablab.jpg'),
      title: 'FabLab Competitions',
      description: 'Bring your engineering and fabrication skills to life by designing and prototyping innovative projects using cutting-edge tools and technologies.',
      link: '/competitions'
    }
    ,
    {
      image: require('../../assets/imgs/vexComp/ST-math.jpeg'),
      title: 'ST egy Math Competitions',
      description: 'the ability to perform mathematical calculations quickly and accurately in the mind without using a calculator or paper. It enhances problem-solving skills, memory, and concentration.',
      link: '/competitions'
    },
    {
      image: require('../../assets/imgs/vexComp/graphic.jpg'),
      title: 'Graphic Design Competitions',
      description: 'Unleash your creativity in graphic design, creating stunning visuals, branding concepts, and digital artwork to impress judges and audiences.',
      link: '/competitions'
    }

  ];

  return (
    <div className="flex flex-col items-center p-10 md:px-20">
      <div className="mb-8">
        <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-500 text-5xl font-black text-center">
          RPAIR CHALLENGES
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl">
        {cardsData.map((card, index) => (
          <Link to={card.link} key={index} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <div
              className="w-full h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className="p-4">
              <div className="text-xl font-bold text-cyan-700 mb-2 text-center">{card.title}</div>
              <p className="text-gray-500 text-sm text-center">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
     
    </div>
  );
};

export default CardSlider;


