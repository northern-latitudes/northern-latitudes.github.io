---
layout: page
title: Resources
permalink: /resources/
nav: true
---

{% assign pages = site.pages | where: "resource", true %}

<div class="row resources">
  {% for res in pages %}
  <div class="col-md-6 text-center resource">
    <a class="btn btn-info btn-fat" href="{{ res.url }}" role="button">
      <span class="fa fa-{{ res.icon }}"></span>
    </a>
    <h2>{{ res.title }}</h2>
    <p>{{ res.description }}
    <a class="btn btn-info btn-xs" href="{{ res.url }}" role="button">View »</a></p>
  </div>
  {% endfor %}
</div>
