---
title: Raw Music From Free Movements
description: Human Body Pose Sequences into Audio Waveforms.
date: 2021-08
status: highlights
tags:
  - Neural Audio Synthesis
  - Musical AI
  - Movement Computing
  - Research
thumbnail: /content-images/projects/ramfem/movement_audio.png
---

**Authors**

| Author | Affiliation |
| --- | --- |
| Kıvanç Tatar | Chalmers University of Technology, Sweden|
| Daniel Bisig | Zurich University of the Arts, Switzerland |

<img src="/content-images/projects/ramfem/movement_audio.png" alt="Multimodal dataset in Raw Music From Free Movements." style="display:block; margin:0 auto; max-width:1080px; height:auto;" />

## Description

Raw Music from Free Movements [1] is a deep learning architecture that translates pose sequences into audio waveforms. The architecture combines a sequence-to-sequence model generating audio encodings and an adversarial autoencoder that generates raw audio from audio encodings. Experiments have been conducted with two datasets: a dancer improvising freely to a given music, and music created through simple movement sonification. The paper presents preliminary results. These will hopefully lead closer towards a model which can learn from the creative decisions a dancer makes when translating music into movement and then follow these decisions reversely for the purpose of generating music from movement.

## Architecture

<img src="/content-images/projects/ramfem/ramfem-arch.png" alt="The Deep Learning architecture in Raw Music From Free Movements." style="display:block; margin:0 auto; max-width:1280px; height:auto;" />

## Examples

Two different datasets were employed for training, named improvisation dataset and sonification dataset. The improvisation dataset consists of pose sequences and audio that have been recorded while a dancer was freely improvising to a given music. The dancer is an expert with a specialisation in contemporary dance and improvisation. The music consists of short excerpts of royalty free music including experimental electronic music, free jazz, and contemporary classic. The pose sequences have been acquired using the markerless motion capture system (The Captury ) in the iLab at MotionBank, University for Applied Research, Mainz. The recording is 10 minutes in length which corresponds to a sequence of 30000 poses. Each pose consists of 29 joints whose relative orientations are represented by quaternions.

The sonification dataset contains the same pose sequences as the improvisation dataset. The audio of this dataset was created afterwards, through sonification, employing a very simple sound synthesis consisting of two sine oscillators controlled by the dancer’s hands. The frequency and amplitude of each oscillator are proportional to the height and velocity of the corresponding hand, respectively. The authors created this dataset to verify the performance of RAMFEM.

## Resources

<i class="fa-brands fa-github"></i> <b>Code:</b> <a>https://bitbucket.org/dbisig/rawmusicfromfreemovements</a>

<i class="fa-solid fa-plus"></i> <b>Supplementary Material:</b> <a>https://zenodo.org/record/4656086</a>

## Acknowledgements

The authors’ thanks go to the dancers who have contributed countless hours o their spare time to the motion capture recordings. Further thanks go to MotionBank for providing their infrastructure and assisting in the recordings. This research is conducted in the context of a Marie Curie Fellowship and is funded by the European Union. The collaboration of the second author has been supported by the Canada Council for the Arts.

## References

[1] Bisig D., Tatar, K. (2021). Raw Music from Free Movements: Early Experiments in Using Machine Learning to Create Raw Audio from Dance Movements. In Proceedings of AI Music Creativity Conference 2021. [Best Paper Award](https://aimc2021.iem.at/wp-content/uploads/2021/06/AIMC_2021_Bisig_Tatar.pdf).