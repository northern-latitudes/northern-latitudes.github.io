---
layout: page
title: Announcements
cat: announcement
permalink: /announcement/
resource: false
description: 
icon: 
---

{% assign pages = site.posts | where: "category", page.cat %}
<div class="resources">
<ul class="list-group media-list post-list">
    {% for post in pages %}
    <li class="list-group-item media">
        <div class="media-left">
            <a href="{{ post.url | prepend: site.github.url }}">
              <img class="media-object img-rounded"
                src="{% if post.icon == 'default' %}
                {{site.github.url}}/assets/images/logo.png
                {% else %}
                {{site.github.url}}/assets/images/logos/{{post.icon}}300.jpg{% endif %}" alt="Post Icon">
            </a>
        </div>
        <div class="media-body">
            <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
            <h4 class="media-heading">
              <a class="post-link" href="{{ post.url | prepend: site.github.url }}">{{ post.title }}</a>
            </h4>
            <p>
              {{ post.content | strip_html | truncatewords: 50 }}
              {% assign val = post.content | strip_html | number_of_words %}
              {% if val > 50 %}
              <a class="post-link small-text" href="{{ post.url | prepend: site.github.url }}">more</a>
              {% endif %}
            </p>

        </div>
    </li>
    {% unless loop.last %}<hr/>{% endunless %}
    {% endfor %}
</ul>
</div>
