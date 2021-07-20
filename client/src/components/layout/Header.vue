<template>
  <header>
    <b-navbar
      id="navigation"
      tabs
      tag="div"
      class="topbar"
    >
      <b-navbar-brand href="/auth">
        <img
          src="assets/images/Quant-logo.png"
          alt="Quant-logo"
        >
      </b-navbar-brand>

      <b-navbar-nav class="nav_class d-flex justify-content-between m-l-35">
        <b-nav-item
          v-for="(item, index) in nav"
          :key="`${index}`"
          :to="{
            name: item.routeName
          }"
          active-class="activeNavClass"
          class="ml-4 text-center"
          :class="{'w-169': item.showCount && updatedSubscriptionsCount }"
        >
          <span class="text-light">{{ item.name }}</span>
          <span
            v-if="item.showCount && updatedSubscriptionsCount"
            class="topbar-badge"
          >
            {{ updatedSubscriptionsCount }}
          </span>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </header>
</template>

<script>
import {
  R_SINGLE_TRANSACTION,
  R_LINKED_TRANSACTIONS,
  R_SUBSCRIPTIONS,
} from '@/router/routes';

import { mapGetters } from 'vuex';

export default {
  name: 'Header',
  data() {
    return {
      nav: [
        {
          name: 'Single Transaction',
          routeName: R_SINGLE_TRANSACTION,
        },
        {
          name: 'Linked Transactions',
          routeName: R_LINKED_TRANSACTIONS,
        },
        {
          name: 'Subscriptions',
          routeName: R_SUBSCRIPTIONS,
          showCount: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['updatedSubscriptionsCount']),
  },
};
</script>
