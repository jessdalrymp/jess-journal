
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-jess-subtle to-jess-subtle/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Start Your Self-Discovery Journey Today</h2>
        <p className="text-xl text-jess-muted max-w-2xl mx-auto mb-4">
          Join thousands who are using JESS to better understand themselves and shape their futures.
        </p>
        <p className="text-lg font-semibold text-jess-accent mb-8">
          🎉 Limited time offer: Use code <span className="font-mono bg-black/5 px-2 py-1 rounded">BETA30</span> for a 30-day free trial!
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="px-8">
            Begin Your Story
          </Button>
        </Link>
      </div>
    </section>
  );
};
