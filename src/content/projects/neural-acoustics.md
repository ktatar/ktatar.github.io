---
title: Neural Acoustics
description: A Deep Learning Framework For Musical Acoustics Simulations
date: 2025-08-15
status: current
tags:
  - Neural Audio Synthesis
  - Musical AI
  - Research
thumbnail: /content-images/projects/neural-acoustics/2024-aimc-neuralacoustics.jpg
---

| Author | Affiliation |
| --- | --- |
| Mattia Martelli | Chalmers University of Technology, Sweden; and Polytechnic Institute of Milan, Italy |
| Jiafeng Chen | Northeastern University, USA |
| Kıvanç Tatar | Chalmers University of Technology, Sweden |
| Victor Zappi | Northeastern University, USA |

## Description

<img src="/content-images/projects/neural-acoustics/2024-aimc-neuralacoustics.jpg" alt="Neural Acoustics" style="display:block; margin:0 auto; max-width:500px; height:auto;" />

The acoustic modeling of musical instruments is a heavy computational process, often bound to the solution of complex systems of partial differential equations (PDEs). Numerical models can achieve a high level of accuracy, but they may take up to several hours to complete a full simulation, especially in the case of intricate musical mechanisms. The application of deep learning, and in particular of neural operators that learn mappings between function spaces, has the potential to revolutionize how acoustics PDEs are solved and noticeably speed up musical simulations. However, extensive research is necessary to understand the applicability of such operators in musical acoustics; this requires large datasets, capable of exemplifying the relationship between input parameters (excitation) and output solutions (acoustic wave propagation) per each target musical instrument/configuration. With this work [1], we present an open-access, open-source framework designed for the generation of numerical musical acoustics datasets and for the training/benchmarking of acoustics neural operators. We first describe the overall structure of the framework and the proposed data generation workflow. Then, we detail the first numerical models that were ported to the framework. This work is a first step towards the gathering of a research community that focuses on deep learning applied to musical acoustics, and shares workflows and benchmarking tools.

## Code

<i class="fa-brands fa-github"></i> <a>https://github.com/ktatar/neuralacoustics</a>

## Acknowledgements

This work was supported by the Wallenberg AI, Autonomous Systems and Software Program – Humanities and Society (WASP-HS) funded by the Marianne and Marcus Wallenberg Foundation and the Marcus and Amalia Wallenberg Foundation. 

## References 

[1] Chen, Jiafeng, Tatar, Kıvanç, & Zappi, Victor. (2024). A Deep Learning Framework for Musical Acoustics Simulations. In Proceedings of the AI Music Creativity Conference. Oxford, London, September 2024. https://aimc2024.pubpub.org/pub/5cl1cvmy/release/1