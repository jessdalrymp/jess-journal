
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[#F97316] to-[#FDE1D3]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Start Your Self-Discovery Journey Today</h2>
        <p className="text-xl text-white max-w-2xl mx-auto mb-8">
          Join thousands who are using JESS to better understand themselves and shape their futures.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="px-8 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white">
            Begin Your Story
          </Button>
        </Link>
      </div>
    </section>
  );
};
