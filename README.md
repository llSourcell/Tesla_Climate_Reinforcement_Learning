# Tesla_Climate_Reinforcement_Learning
Using Reinforcement Learning on a Tesla to optimize climate and energy 

## Overview 

This is the code for ["Lets Hack My Tesla using Javascript LIVE"](https://youtu.be/i4XvlM_j3A0) the weekly live game show hosted by Siraj Raval. 3 Wizards will each win $175 this week in cryptocurrency. These are all preliminary games for Code Royale Season 1, which starts in a few weeks. Sign up at [http://playcoderoyale.com/](playcoderoyale.com). This code using a mixture of TeslaJS and the ReinforceJS library. It uses both to connect to a tesla, retrieve lots of car state data, and use a Deep Q learning agent to learn how to optimally set the temperature to preserve energy usage. (same temp inside and outside the car). Is it perfect? No. Is it a real example of using machine learning in my everyday life for a somewhat useful task? Yes. :) I love this tesla robot. 

## Dependencies

- Nodejs 
- Teslajs 
- reinforcejs
- @babel/core 
- @babel/register
- @babel/preset-env

use npm to install each of the missing dependencies i.e npm install teslajs

## Usage

'node start.js' will run the code as a simple webserver. Visit the URL shown in the output and you will automatically start running the agent. 


## Credits

Credits to TeslaJS and ReinforceJS for their libraries. 
